// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var my_event = require("my_event");

var Cell = cc.Class({
    extends: cc.Component,

    properties: {
        cellData: CellData,
        cellType: -1,
        label: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.label.string = this.cellData.id;
        this.node.position = this.cellData.position;

        do {
            this.cellType = Math.floor(Math.random() * (4 - 0) + 0);
        } while (this.lineSum().length >= 3);

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
            default:
                this.node.color = cc.Color.CYAN;
                break;
        }

    },

    start() {

    },

    // update (dt) {},

    lineSum: function () {
        var ct = this.cellType;

        var xSum = this.cellData.leftSum(ct).concat(this.cellData.rightSum(ct));

        var ySum = this.cellData.topSum(ct).concat(this.cellData.bottomSum(ct));

        if (xSum.length >= 2 || ySum.length >= 2) {
            return xSum.concat([this]).concat(ySum);
        } else {
            return [];
        }
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
        cellDatas.forEach(cd => {
            tween.to(0.2, { position: cd.position })
        });
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
});

var CellData = cc.Class({
    statics: {
        size: 68,
        _cellDatas: null,

        initByMapData: function (mapData) {
            if (!this._cellDatas) {
                this._cellDatas = {};
            }

            for (const k in mapData) {
                var v = mapData[k];
                this._cellDatas[k] = CellData.generateCellData(cc.v2(v.x, v.y, 0));
            }

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
            }
        },

        getCellDataById: function (id) {
            if (this._cellDatas.hasOwnProperty(id)) {
                return this._cellDatas[id];
            }
            return null;
        },

        generateCellData: function (position) {
            var cellData = new CellData();
            cellData._position = position;
            return cellData;
        },
    },

    properties: {
        _position: cc.Vec3,
        id: {
            get: function () {
                if (this._position) {
                    return this._position.x + "_" + this._position.y;
                }

                return "";
            }
        },
        position: {
            get: function () {
                return this._position.add(cc.v2(0.5, 0.5)).mul(CellData.size);
            }
        },
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
    }
});

module.exports = CellData;
