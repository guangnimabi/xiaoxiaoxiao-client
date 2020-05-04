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
        _cellDatas: null,


        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;

        //regist touch event
        my_event.receiver = self.content;
        my_event.registOperateEvent(function (position, direction) {
            var cellKey = "" + Math.floor(position.x / 68) + "_" + Math.floor(position.y / 68);
            // cc.log(cellKey + "    "+direction.x +"," + direction.y);
            if (self._cellDatas.hasOwnProperty(cellKey)) {
                self._cellDatas[cellKey].current.exchange(direction);
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
                    var disappearCells = cell1.lineSum().concat(cell2.lineSum());
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
            var callback = function (cell) {
                var index = allCells.indexOf(cell);
                if (index > -1) {
                    allCells.splice(index, 1);
                }

                if (allCells.length === 0) {
                    cc.log("renew success");
                }
            };

            //清理要消除的cell
            var clearCellDatas = [];
            renewCells.forEach(renewCell => {
                clearCellDatas.push(renewCell.cellData);

                renewCell.cellData.current = null;
                renewCell.cellData = null;
            });

            //处理现有的cell移动
            clearCellDatas.forEach(clearCellData => {
                var lastCells = clearCellData.allLastCells();
                lastCells.forEach(lastCell => {
                    var moveCellDatas = lastCell.cellData.allMoveCellDatas();
                    if (moveCellDatas.length > 0) {
                        allCells.push(lastCell);
                        var targetCellData = moveCellDatas[moveCellDatas.length - 1];

                        lastCell.cellData.current = null;
                        targetCellData.current = lastCell;
                        lastCell.cellData = targetCellData;

                        lastCell.move(moveCellDatas, callback);
                    }
                });
            });
        });

        //init map
        self._cellDatas = {};

        var mapData = Map.getMapData();
        for (const key in mapData) {
            const element = mapData[key];

            var cellData = new CellData();
            cellData.mapData = element;
            self._cellDatas[key] = cellData;
        }

        for (const key in self._cellDatas) {

            const cellData = self._cellDatas[key];
            if (cellData.mapData.last && self._cellDatas.hasOwnProperty(cellData.mapData.last)) {
                cellData.last = self._cellDatas[cellData.mapData.last];
            }
            if (cellData.mapData.next && self._cellDatas.hasOwnProperty(cellData.mapData.next)) {
                cellData.next = self._cellDatas[cellData.mapData.next];
            }
            if (cellData.mapData.top && self._cellDatas.hasOwnProperty(cellData.mapData.top)) {
                cellData.top = self._cellDatas[cellData.mapData.top];
            }
            if (cellData.mapData.bottom && self._cellDatas.hasOwnProperty(cellData.mapData.bottom)) {
                cellData.bottom = self._cellDatas[cellData.mapData.bottom];
            }
            if (cellData.mapData.left && self._cellDatas.hasOwnProperty(cellData.mapData.left)) {
                cellData.left = self._cellDatas[cellData.mapData.left];
            }
            if (cellData.mapData.right && self._cellDatas.hasOwnProperty(cellData.mapData.right)) {
                cellData.right = self._cellDatas[cellData.mapData.right];
            }

        }

        //init cells
        cc.loader.loadRes("prefab/cell", function (err, prefab) {

            for (const key in self._cellDatas) {
                const cellData = self._cellDatas[key];

                var node = cc.instantiate(prefab);
                var cell = node.getComponent("cell");

                cellData.current = cell;
                cell.cellData = cellData;

                self.content.addChild(node);
            }
        });
    },

    start() {

    },

    // update (dt) {},
});