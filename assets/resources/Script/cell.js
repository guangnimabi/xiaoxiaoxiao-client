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
        this.label.string = "" + this.cellData.mapData.x + "_" + this.cellData.mapData.y;
        this.node.position = cc.v2(this.cellData.mapData.x + 0.5, this.cellData.mapData.y + 0.5).mulSelf(68);

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
        }

        return [];
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

    move: function (callback) {
        cc.tween(this.node)
            .to(0.3, { position: cc.v2(this.cellData.mapData.x + 0.5, this.cellData.mapData.y + 0.5).mulSelf(68) })
            .call(() => {
                callback(this);
            })
            .start()
    },
});

var CellData = cc.Class({
    properties: {
        mapData: null,
        current: {
            default: null,
            type: Cell
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
        }
    },

    leftSum: function (ct) {
        if (this.left && this.left.current && this.left.current.cellType === ct) {
            return [this.current].concat(this.left.leftSum(ct));
        }

        return [];
    },

    rightSum: function (ct) {
        if (this.right && this.right.current && this.right.current.cellType === ct) {
            return [this.current].concat(this.right.rightSum(ct));
        }

        return [];
    },

    topSum: function (ct) {
        if (this.top && this.top.current && this.top.current.cellType === ct) {
            return [this.current].concat(this.top.topSum(ct));
        }

        return [];
    },

    bottomSum: function (ct) {
        if (this.bottom && this.bottom.current && this.bottom.current.cellType === ct) {
            return [this.current].concat(this.bottom.bottomSum(ct));
        }

        return [];
    },


});

module.exports = CellData;
