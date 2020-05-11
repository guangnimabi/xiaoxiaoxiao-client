// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Map = require("map");
var Cell = require("cell");
var my_event = require("my_event");

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        },
        root: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;

        if (self.root.width > self.root.height) {
            Cell.size = Math.floor((self.root.height - 8) / 8);
        } else {
            Cell.size = Math.floor((self.root.width - 8) / 8);
        }

        //regist touch event
        my_event.receiver = self.content;
        my_event.registOperateEvent(function (position, direction) {
            var id = "" + Math.floor(position.x / Cell.size) + "_" + Math.floor(position.y / Cell.size) + "_0";
            var cell = Cell.getCellById(id);
            if (cell && cell.current) {
                cell.current.exchange(direction);
            }
        });
        my_event.registExchangeEvent(function (stone1, stone2) {
            var tmpCell = stone1.cell;

            stone1.cell = stone2.cell;
            stone1.cell.current = stone1;
            stone2.cell = tmpCell;
            stone2.cell.current = stone2;

            var allStones = [stone1, stone2];
            var callback = function (stone) {
                var index = allStones.indexOf(stone);
                if (index > -1) {
                    allStones.splice(index, 1);
                }

                if (allStones.length === 0) {
                    var disappearStones = stone1.lineSum();
                    var stone2LineSum = stone2.lineSum();
                    for (let i = 0; i < stone2LineSum.length; i++) {
                        const element = stone2LineSum[i];
                        if (disappearStones.indexOf(element) === -1) {
                            disappearStones.push(element);
                        }
                    }

                    if (disappearStones.length === 0) {
                        my_event.dispatchExchangeRollbackEvent(stone1, stone2);
                    } else {
                        my_event.dispatchDisappearEvent(disappearStones);
                    }
                }
            }

            stone1.move([stone1.cell], callback);
            stone2.move([stone2.cell], callback);

            my_event.dispatchOperateEvent(false);
        });
        my_event.registExchangeRollbackEvent(function (stone1, stone2) {
            var tmpCell = stone1.cell;

            stone1.cell = stone2.cell;
            stone1.cell.current = stone1;
            stone2.cell = tmpCell;
            stone2.cell.current = stone2;

            var allStones = [stone1, stone2];
            var callback = function (stone) {
                var index = allStones.indexOf(stone);
                if (index > -1) {
                    allStones.splice(index, 1);
                }

                if (allStones.length === 0) {
                    my_event.dispatchOperateEvent(true);
                }
            };

            stone1.move([stone1.cell], callback);
            stone2.move([stone2.cell], callback);
        });
        my_event.registDisappearEvent(function (disappearStones) {
            var renewStones = [].concat(disappearStones);
            var callback = function (stone) {
                var index = disappearStones.indexOf(stone);
                if (index > -1) {
                    disappearStones.splice(index, 1);
                }

                if (disappearStones.length === 0) {
                    my_event.dispatchRenewEvent(renewStones);
                }
            };

            disappearStones.forEach(stone => {
                stone.disappear(callback);
            });
        });
        my_event.registRenewEvent(function (renewStones) {
            var allStones = [];
            var checkStones = [];
            var callback = function (stone) {
                checkStones.push(stone);
                var index = allStones.indexOf(stone);
                if (index > -1) {
                    allStones.splice(index, 1);
                }

                if (allStones.length === 0) {
                    var disappearStones = [];

                    for (let i = 0; i < checkStones.length; i++) {
                        const checkStone = checkStones[i];
                        var stoneLineSum = checkStone.lineSum();
                        for (let j = 0; j < stoneLineSum.length; j++) {
                            const element = stoneLineSum[j];
                            if (disappearStones.indexOf(element) === -1) {
                                disappearStones.push(element);
                            }
                        }
                    }

                    if (disappearStones.length === 0) {//renew完毕后没有横竖成行的，要判定还能不能消
                        var canPlay = false;
                        checkStones = Cell.getAllCellContent();
                        for (let i = 0; i < checkStones.length; i++) {
                            const checkStone = checkStones[i];
                            var canMoveStone = checkStone.tryMoveStone();
                            if (canMoveStone) {
                                canPlay = true;
                                break;
                            }
                        }

                        if (canPlay) {
                            my_event.dispatchOperateEvent(true);
                        } else {
                            my_event.dispatchDisappearEvent(checkStones);
                        }
                    } else {
                        my_event.dispatchDisappearEvent(disappearStones);
                    }
                }
            };

            var moveStone = function (currentStone) {
                var moveCells = currentStone.cell.allMoveCell();
                if (moveCells.length > 0) {
                    allStones.push(currentStone);
                    var targetCell = moveCells[moveCells.length - 1];

                    currentStone.cell.current = null;
                    currentStone.cell = targetCell;
                    currentStone.cell.current = currentStone;

                    currentStone.move(moveCells, callback);
                }
            };

            //处理消除的stone
            var clearCells = [];
            for (let index = 0; index < renewStones.length; index++) {
                var renewStone = renewStones[index];

                clearCells.push(renewStone.cell);

                var bornCell = renewStone.cell.findBorn();

                renewStone.cell.current = null;

                renewStone.cell = bornCell;
                renewStone.cell.current = renewStone;
            }

            //计算现有的stone移动
            for (let index = 0; index < clearCells.length; index++) {
                const clearCell = clearCells[index];
                var lastStones = clearCell.allLastContent();
                lastStones.forEach(lastStone => {
                    moveStone(lastStone);
                });
            }

            //计算消除的stone移动
            renewStones.forEach(renewStone => {
                renewStone.renew();
                moveStone(renewStone);
            });
        });

        //init map
        var mapData = Map.getMapData();
        Cell.initByMapData(mapData);

        //init stones
        cc.loader.loadRes("prefab/cell", function (err, prefab) {

            var allStones = [];
            for (const id in mapData) {
                var cell = Cell.getCellById(id);
                if (cell && cell.isCommon()) {
                    var node = cc.instantiate(prefab);
                    var stone = node.getComponent("stone");

                    cell.current = stone;
                    stone.cell = cell;

                    do {
                        stone.renew();
                    } while (stone.lineSum().length >= Cell.lineLimit);
                    allStones.push(stone);

                    self.content.addChild(node);
                }
            }

            var canPlay = false;
            for (let i = 0; i < allStones.length; i++) {
                const checkStone = allStones[i];
                var canMoveStone = checkStone.tryMoveStone();
                if (canMoveStone) {
                    canPlay = true;
                    break;
                }
            }

            if (canPlay) {
                my_event.dispatchOperateEvent(true);
            } else {
                my_event.dispatchDisappearEvent(allStones);
            }
        });
    },

    start() {

    },

    update(dt) {

    },
});