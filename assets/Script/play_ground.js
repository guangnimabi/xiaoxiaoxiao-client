// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Map = require("./data/map");
var CellData = require("../resources/Script/cell");
var my_event = require("my_event");

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;

        //regist touch event
        my_event.receiver = self.content;
        my_event.registOperateEvent(function (position, direction) {
            var id = "" + Math.floor(position.x / CellData.size) + "_" + Math.floor(position.y / CellData.size) + "_0";
            var cellData = CellData.getCellDataById(id);
            if (cellData && cellData.current) {
                cellData.current.exchange(direction);
            }
        });
        my_event.registExchangeEvent(function (cell1, cell2) {
            var tmpCellData = cell1.cellData;

            cell1.cellData = cell2.cellData;
            cell1.cellData.current = cell1;
            cell2.cellData = tmpCellData;
            cell2.cellData.current = cell2;

            var allCells = [cell1, cell2];
            var callback = function (cell) {
                var index = allCells.indexOf(cell);
                if (index > -1) {
                    allCells.splice(index, 1);
                }

                if (allCells.length === 0) {
                    var disappearCells = cell1.lineSum();
                    var cell2LineSum = cell2.lineSum();
                    for (let i = 0; i < cell2LineSum.length; i++) {
                        const element = cell2LineSum[i];
                        if (disappearCells.indexOf(element) === -1) {
                            disappearCells.push(element);
                        }
                    }

                    if (disappearCells.length === 0) {
                        my_event.dispatchExchangeRollbackEvent(cell1, cell2);
                    } else {
                        my_event.dispatchDisappearEvent(disappearCells);
                    }
                }
            }

            cell1.move([cell1.cellData], callback);
            cell2.move([cell2.cellData], callback);
        });
        my_event.registExchangeRollbackEvent(function (cell1, cell2) {
            var tmpCellData = cell1.cellData;

            cell1.cellData = cell2.cellData;
            cell1.cellData.current = cell1;
            cell2.cellData = tmpCellData;
            cell2.cellData.current = cell2;

            var allCells = [cell1, cell2];
            var callback = function (cell) {
                var index = allCells.indexOf(cell);
                if (index > -1) {
                    allCells.splice(index, 1);
                }

                if (allCells.length === 0) {
                    //打开控制面板
                    cc.log("rollback success");
                }
            };

            cell1.move([cell1.cellData], callback);
            cell2.move([cell2.cellData], callback);
        });
        my_event.registDisappearEvent(function (disappearCells) {
            var renewCells = [].concat(disappearCells);
            var callback = function (cell) {
                var index = disappearCells.indexOf(cell);
                if (index > -1) {
                    disappearCells.splice(index, 1);
                }

                if (disappearCells.length === 0) {
                    my_event.dispatchRenewEvent(renewCells);
                }
            };

            disappearCells.forEach(cell => {
                cell.disappear(callback);
            });
        });
        my_event.registRenewEvent(function (renewCells) {
            var allCells = [];
            var checkCells = [];
            var callback = function (cell) {
                checkCells.push(cell);
                var index = allCells.indexOf(cell);
                if (index > -1) {
                    allCells.splice(index, 1);
                }

                if (allCells.length === 0) {
                    var disappearCells = [];

                    for (let i = 0; i < checkCells.length; i++) {
                        const checkCell = checkCells[i];
                        var cellLineSum = checkCell.lineSum();
                        for (let j = 0; j < cellLineSum.length; j++) {
                            const element = cellLineSum[j];
                            if (disappearCells.indexOf(element) === -1) {
                                disappearCells.push(element);
                            }
                        }
                    }

                    if (disappearCells.length === 0) {

                    } else {
                        my_event.dispatchDisappearEvent(disappearCells);
                    }
                }
            };

            var moveCell = function (currentCell) {
                var moveCellDatas = currentCell.cellData.allMoveCellDatas();
                if (moveCellDatas.length > 0) {
                    allCells.push(currentCell);
                    var targetCellData = moveCellDatas[moveCellDatas.length - 1];

                    currentCell.cellData.current = null;
                    currentCell.cellData = targetCellData;
                    currentCell.cellData.current = currentCell;

                    currentCell.move(moveCellDatas, callback);
                }
            };

            //处理消除的cell
            var clearCellDatas = [];
            for (let index = 0; index < renewCells.length; index++) {
                var renewCell = renewCells[index];

                clearCellDatas.push(renewCell.cellData);

                var bornCellData = renewCell.cellData.findBorn();

                renewCell.cellData.current = null;

                renewCell.cellData = bornCellData;
                renewCell.cellData.current = renewCell;
            }

            //计算现有的cell移动
            for (let index = 0; index < clearCellDatas.length; index++) {
                const clearCellData = clearCellDatas[index];
                var lastCells = clearCellData.allLastCells();
                lastCells.forEach(lastCell => {
                    moveCell(lastCell);
                });
            }

            //计算消除的cell移动
            renewCells.forEach(renewCell => {
                renewCell.renew();
                moveCell(renewCell);
            });
        });

        //init map
        var mapData = Map.getMapData();
        CellData.initByMapData(mapData);

        //init cells
        cc.loader.loadRes("prefab/cell", function (err, prefab) {

            for (const id in mapData) {
                var cellData = CellData.getCellDataById(id);
                if (cellData && cellData.isCommon()) {
                    var node = cc.instantiate(prefab);
                    var cell = node.getComponent("cell");

                    cellData.current = cell;
                    cell.cellData = cellData;

                    self.content.addChild(node);
                }
            }
        });
    },

    start() {

    },

    // update (dt) {},
});