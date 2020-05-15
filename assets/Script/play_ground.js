// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Map = require("Map");
var Cell = require("Cell");
var Event = require("Event");
var StoneFactory = require("StoneFactory");

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
        Event.receiver = self.content;
        Event.registOperateEvent(function (position, direction) {
            var id = "" + Math.floor(position.x / Cell.size) + "_" + Math.floor(position.y / Cell.size) + "_0";
            var cell = Cell.getCellById(id);
            if (cell && cell.stone) {
                cell.stone.exchange(direction);
            }
        });
        Event.registExchangeEvent(function (stone1, stone2) {
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
                        Event.dispatchExchangeRollbackEvent(stone1, stone2);
                    } else {
                        Event.dispatchDisappearEvent(disappearStones);
                    }
                }
            }

            let cell1 = stone1.cell;
            let cell2 = stone2.cell;

            stone1.move([cell2], callback);
            stone2.move([cell1], callback);

            Event.dispatchOperateEvent(false);
        });
        Event.registExchangeRollbackEvent(function (stone1, stone2) {
            var allStones = [stone1, stone2];
            var callback = function (stone) {
                var index = allStones.indexOf(stone);
                if (index > -1) {
                    allStones.splice(index, 1);
                }

                if (allStones.length === 0) {
                    Event.dispatchOperateEvent(true);
                }
            };

            let cell1 = stone1.cell;
            let cell2 = stone2.cell;

            stone1.move([cell2], callback);
            stone2.move([cell1], callback);
        });
        Event.registDisappearEvent(function (disappearStones) {
            let emptyCells = [];
            let callback = function (cell) {
                emptyCells.push(cell);

                if (emptyCells.length === disappearStones.length) {
                    Event.dispatchRenewEvent(emptyCells);
                }
            };

            disappearStones.forEach(stone => {
                stone.disappear(callback);
            });
        });
        Event.registRenewEvent(function (emptyCells) {
            var allStones = [];
            var checkStones = [];
            var callback = function (stone) {
                checkStones.push(stone);
                var index = allStones.indexOf(stone);
                if (index > -1) {
                    allStones.splice(index, 1);
                }

                if (allStones.length === 0) {
                    //选取种子stone
                    let seedStones = [];
                    let seedLinkStones = [];

                    for (let i = 0; i < checkStones.length; i++) {
                        const cStone = checkStones[i];
                        var cStoneLineSum = cStone.lineSum();

                        if (cStoneLineSum.length>0) {
                            var deleteSeeds = [];
                            var canAddSeed = true;

                            for (let j = 0; j < seedLinkStones.length; j++) {
                                const linkStones = seedLinkStones[j];
                                if (linkStones.indexOf(cStone) != -1) {
                                    if (linkStones.length >= cStoneLineSum.length) {
                                        canAddSeed = false;
                                    } else {
                                        deleteSeeds.push(j);
                                    }
                                }
                            }
                            for (let j = 0; j < deleteSeeds.length; j++) {
                                seedStones.splice(deleteSeeds[j], 1);
                                seedLinkStones.splice(deleteSeeds[j], 1);
                            }
                            if (canAddSeed) {
                                seedStones.push(cStone);
                                seedLinkStones.push(cStoneLineSum);
                            }
                        }
                    }

                    //统计连消的stone
                    var disappearStones = [];
                    for (let i = 0; i < seedLinkStones.length; i++) {
                        const linkStones = seedLinkStones[i];
                        for (let j = 0; j < linkStones.length; j++) {
                            const dStone = linkStones[j];
                            if (disappearStones.indexOf(dStone) === -1) {
                                disappearStones.push(dStone);
                            }
                        }
                    }

                    if (disappearStones.length === 0) {//renew完毕后没有横竖成行的，要判定还能不能消
                        var canPlay = false;
                        checkStones = Cell.getAllStones();
                        for (let i = 0; i < checkStones.length; i++) {
                            const checkStone = checkStones[i];
                            var canMoveStone = checkStone.tryMoveStone();
                            if (canMoveStone) {
                                canPlay = true;
                                break;
                            }
                        }

                        if (canPlay) {
                            Event.dispatchOperateEvent(true);
                        } else {
                            Event.dispatchDisappearEvent(checkStones);
                        }
                    } else {
                        Event.dispatchDisappearEvent(disappearStones);
                    }
                }
            };

            for (const emptyCell of emptyCells) {
                //现有需要掉落的stone
                for (const stone of emptyCell.allLastStones()) {
                    if (allStones.indexOf(stone) === -1) {
                        allStones.push(stone);
                    }
                }

                //新生成stone
                let newStone = StoneFactory.createStone(StoneFactory.randomStoneType() + '_0', self.content, emptyCell.findBorn())
                allStones.push(newStone);
            }

            for (const stone of allStones) {
                stone.collectMoveCells();
            }

            for (const stone of allStones) {
                stone.move([], callback);
            }
        });

        //init map
        var mapData = Map.getMapData();
        Cell.initByMapData(mapData);

        //init stones
        cc.loader.loadResDir("prefab/stone", function (err, prefabs) {

            for (let i = 0; i < prefabs.length; i++) {
                const prefab = prefabs[i];
                StoneFactory.addStonePrefab(prefab);
            }

            let allStones = [];
            for (const id in mapData) {
                let cell = Cell.getCellById(id);

                if (cell && cell.isCommon()) {
                    let st = StoneFactory.randomStoneType();
                    while (cell.lineSum(st).length >= Cell.lineLimit - 1) {
                        st = StoneFactory.randomStoneType();
                    }

                    let stone = StoneFactory.createStone(st + '_0', self.content, cell);
                    allStones.push(stone);
                }
            }

            let canPlay = false;
            for (let i = 0; i < allStones.length; i++) {
                const checkStone = allStones[i];
                let canMoveStone = checkStone.tryMoveStone();
                if (canMoveStone) {
                    canPlay = true;
                    break;
                }
            }

            if (canPlay) {
                Event.dispatchOperateEvent(true);
            } else {
                Event.dispatchDisappearEvent(allStones);
            }
        });
    },

    start() {

    },

    update(dt) {

    },
});