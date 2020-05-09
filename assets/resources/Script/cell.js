// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var my_event = require("my_event");
var random_util = require("random_util")

const CELL_TYPE_COMMON = 0;
const CELL_TYPE_BORN = 1;

var Cell = cc.Class({
    extends: cc.Component,

    properties: {
        cellData: CellData,
        cellType: -1,
        label: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.width = CellData.size - 4;
        this.node.height = CellData.size - 4;
        this.label.string = this.cellData.id;
    },

    start() {

    },

    // update (dt) {},

    //返回横竖直线统计连续的cellData
    lineSum: function () {
        var ct = this.cellType;

        var xSum = this.cellData.leftSum(ct).concat(this.cellData.rightSum(ct));

        var ySum = this.cellData.topSum(ct).concat(this.cellData.bottomSum(ct));

        var result = [];

        if (xSum.length >= CellData.lineLimit - 1) {
            result = result.concat(xSum);
        }

        if (ySum.length >= CellData.lineLimit - 1) {
            result = result.concat(ySum);
        }

        if (result.length >= CellData.lineLimit - 1) {
            result.push(this);
        }

        return result;
    },

    //返回尝试移动后能横竖成行的cell
    tryMoveCell: function () {
        var ct = this.cellType;
        var indexs = ["top", "bottom", "left", "right"];
        random_util.randomArray(indexs);
        for (let index = 0; index < indexs.length; index++) {
            const direction = indexs[index];
            switch (direction) {
                case "top":
                    if (this.cellData.top) {
                        var sum = this.cellData.top.topSum(ct);
                        if (sum.length >= CellData.lineLimit - 1) {
                            return this.cellData.top.current;
                        }
                        sum = this.cellData.top.leftSum(ct).concat(this.cellData.top.rightSum(ct));
                        if (sum.length >= CellData.lineLimit - 1) {
                            return this.cellData.top.current;
                        }
                    }
                    break;
                case "bottom":
                    if (this.cellData.bottom) {
                        var sum = this.cellData.bottom.bottomSum(ct);
                        if (sum.length >= CellData.lineLimit - 1) {
                            return this.cellData.bottom.current;
                        }
                        sum = this.cellData.bottom.leftSum(ct).concat(this.cellData.bottom.rightSum(ct));
                        if (sum.length >= CellData.lineLimit - 1) {
                            return this.cellData.bottom.current;
                        }
                    }
                    break;
                case "left":
                    if (this.cellData.left) {
                        var sum = this.cellData.left.leftSum(ct);
                        if (sum.length >= CellData.lineLimit - 1) {
                            return this.cellData.left.current;
                        }
                        sum = this.cellData.left.topSum(ct).concat(this.cellData.left.bottomSum(ct));
                        if (sum.length >= CellData.lineLimit - 1) {
                            return this.cellData.left.current;
                        }
                    }
                    break;
                case "right":
                    if (this.cellData.right) {
                        var sum = this.cellData.right.rightSum(ct);
                        if (sum.length >= CellData.lineLimit - 1) {
                            return this.cellData.right.current;
                        }
                        sum = this.cellData.right.topSum(ct).concat(this.cellData.right.bottomSum(ct));
                        if (sum.length >= CellData.lineLimit - 1) {
                            return this.cellData.right.current;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return null;
    },

    exchange: function (direction) {
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            if (direction.x > 0) {
                if (this.cellData.right) {
                    my_event.dispatchExchangeEvent(this, this.cellData.right.current);
                }
            } else {
                if (this.cellData.left) {
                    my_event.dispatchExchangeEvent(this, this.cellData.left.current);
                }
            }
        } else {
            if (direction.y > 0) {
                if (this.cellData.top) {
                    my_event.dispatchExchangeEvent(this, this.cellData.top.current);
                }
            } else {
                if (this.cellData.bottom) {
                    my_event.dispatchExchangeEvent(this, this.cellData.bottom.current);
                }
            }
        }
    },

    move: function (cellDatas, callback) {
        var tween = cc.tween(this.node);
        for (let index = 0; index < cellDatas.length; index++) {
            const cd = cellDatas[index];
            tween.to(0.2, { position: cd.position });
        }
        tween.call(() => {
            callback(this);
        }).start()
    },

    disappear: function (callback) {
        cc.tween(this.node)
            .to(0.2, { scale: 0 })
            .call(() => {
                callback(this);
            })
            .start()
    },

    renew: function () {
        this.node.scale = 1;
        this.node.position = this.cellData.position;

        this.cellType = random_util.randomInt(5);

        switch (this.cellType) {
            case 0:
                this.node.color = cc.Color.RED;
                break;
            case 1:
                this.node.color = cc.Color.GREEN;
                break;
            case 2:
                this.node.color = cc.Color.BLUE;
                break;
            case 3:
                this.node.color = cc.Color.YELLOW;
                break;
            case 4:
                this.node.color = cc.Color.MAGENTA;
                break;
            case 5:
                this.node.color = cc.Color.CYAN;
                break;
            case 6:
                this.node.color = cc.Color.ORANGE;
                break;
            case 7:
                this.node.color = cc.Color.WHITE;
                break;
            default:
                this.node.color = cc.Color.BLACK;
                break;
        }
    },
});

var CellData = cc.Class({
    statics: {
        size: 68,
        lineLimit: 3,
        _cellDatas: null,

        initByMapData: function (mapData) {
            if (!this._cellDatas) {
                this._cellDatas = {};
            }

            //生成所有cell data
            for (const k in mapData) {
                var v = mapData[k];
                CellData.generateCellData(cc.v3(v.x, v.y, 0), v.type);
            }

            //创建各个cell data关联关系
            for (const k in mapData) {
                var v = mapData[k];
                const cellData = this._cellDatas[k];
                if (v.last && this._cellDatas.hasOwnProperty(v.last)) {
                    cellData.last = this._cellDatas[v.last];
                }
                if (v.next && this._cellDatas.hasOwnProperty(v.next)) {
                    cellData.next = this._cellDatas[v.next];
                }
                if (v.top && this._cellDatas.hasOwnProperty(v.top)) {
                    cellData.top = this._cellDatas[v.top];
                }
                if (v.bottom && this._cellDatas.hasOwnProperty(v.bottom)) {
                    cellData.bottom = this._cellDatas[v.bottom];
                }
                if (v.left && this._cellDatas.hasOwnProperty(v.left)) {
                    cellData.left = this._cellDatas[v.left];
                }
                if (v.right && this._cellDatas.hasOwnProperty(v.right)) {
                    cellData.right = this._cellDatas[v.right];
                }
                if (v.born && this._cellDatas.hasOwnProperty(v.born)) {
                    cellData.born = this._cellDatas[v.born];
                }
            }
        },

        getCellDataById: function (id) {
            if (this._cellDatas.hasOwnProperty(id)) {
                return this._cellDatas[id];
            }
            return null;
        },

        getAllCell: function () {
            var allCells = [];
            for (const id in this._cellDatas) {
                const cellData = this._cellDatas[id];
                if (cellData.current) {
                    allCells.push(cellData.current);
                }
            }
            return allCells;
        },

        generateCellData: function (position, type) {
            var cellData = new CellData();
            cellData._position = position;
            cellData.type = type;

            this._cellDatas[cellData.id] = cellData;
            return cellData;
        },
    },

    properties: {
        _position: cc.Vec3,
        id: {
            get: function () {
                if (this._position) {
                    return this._position.x + "_" + this._position.y + "_" + this._position.z;
                }

                return "";
            }
        },
        position: {
            get: function () {
                return this._position.add(cc.v3(0.5, 0.5, 0)).mul(CellData.size);
            }
        },
        type: 0,
        current: {
            default: null,
            type: Cell
        },
        last: {
            default: null,
            type: CellData
        },
        next: {
            default: null,
            type: CellData
        },
        top: {
            default: null,
            type: CellData
        },
        bottom: {
            default: null,
            type: CellData
        },
        left: {
            default: null,
            type: CellData
        },
        right: {
            default: null,
            type: CellData
        },
        born: {
            default: null,
            type: CellData
        },
    },

    isCommon: function () {
        return this.type === CELL_TYPE_COMMON;
    },

    leftSum: function (ct) {
        if (this.left && this.left.current && this.left.current.cellType === ct) {
            return [this.left.current].concat(this.left.leftSum(ct));
        }

        return [];
    },

    rightSum: function (ct) {
        if (this.right && this.right.current && this.right.current.cellType === ct) {
            return [this.right.current].concat(this.right.rightSum(ct));
        }

        return [];
    },

    topSum: function (ct) {
        if (this.top && this.top.current && this.top.current.cellType === ct) {
            return [this.top.current].concat(this.top.topSum(ct));
        }

        return [];
    },

    bottomSum: function (ct) {
        if (this.bottom && this.bottom.current && this.bottom.current.cellType === ct) {
            return [this.bottom.current].concat(this.bottom.bottomSum(ct));
        }

        return [];
    },

    allLastCells: function () {
        if (this.last) {
            if (this.last.current) {
                return [this.last.current].concat(this.last.allLastCells());
            } else {
                return this.last.allLastCells();
            }
        } else {
            return [];
        }
    },

    allMoveCellDatas: function () {
        if (this.next && !this.next.current) {
            return [this.next].concat(this.next.allMoveCellDatas());
        } else {
            return [];
        }
    },

    findBorn: function () {
        if (this.born) {
            return this.born.findBorn();
        } else {
            if (this.current) {
                return this.last.findBorn();
            } else {
                if (!this.last) {
                    var lastCellData = CellData.generateCellData(this._position.sub(cc.v3(0, 0, 1)), CELL_TYPE_BORN);
                    lastCellData.next = this;
                    this.last = lastCellData;
                }
                return this;
            }
        }
    },
});

module.exports = CellData;
