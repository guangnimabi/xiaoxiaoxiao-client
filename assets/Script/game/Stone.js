var Event = require("Event");
var RandomUtil = require("RandomUtil");
var Cell = require("Cell");
var StoneFactory = require('StoneFactory');

module.exports = cc.Class({
    extends: cc.Component,

    properties: () => ({
        cell: {
            default: null,
            type: Cell,
            visible: false,
            serializable: false
        },
        type: -1,
        level: 0,
        disappearLink: {//消除时作为seed链接stone个数
            default: 0,
            visible: false,
            serializable: false
        },
        _moveCells: [],
    }),

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.width = Cell.size - 4;
        this.node.height = Cell.size - 4;
    },

    start() {

    },

    // update (dt) {},

    //返回横竖直线统计连续的stone
    lineSum: function () {
        var result = this.cell.lineSum(this.type);

        if (result.length >= Cell.lineLimit - 1) {
            result.push(this);
        }

        return result;
    },

    //返回尝试移动后能横竖成行的stone
    tryMoveStone: function () {
        var ct = this.type;
        var indexs = ["top", "bottom", "left", "right"];
        RandomUtil.randomArray(indexs);
        for (let index = 0; index < indexs.length; index++) {
            const direction = indexs[index];
            switch (direction) {
                case "top":
                    if (this.cell.top) {
                        var sum = this.cell.top.topSum(ct);
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.top.stone;
                        }
                        sum = this.cell.top.leftSum(ct).concat(this.cell.top.rightSum(ct));
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.top.stone;
                        }
                    }
                    break;
                case "bottom":
                    if (this.cell.bottom) {
                        var sum = this.cell.bottom.bottomSum(ct);
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.bottom.stone;
                        }
                        sum = this.cell.bottom.leftSum(ct).concat(this.cell.bottom.rightSum(ct));
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.bottom.stone;
                        }
                    }
                    break;
                case "left":
                    if (this.cell.left) {
                        var sum = this.cell.left.leftSum(ct);
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.left.stone;
                        }
                        sum = this.cell.left.topSum(ct).concat(this.cell.left.bottomSum(ct));
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.left.stone;
                        }
                    }
                    break;
                case "right":
                    if (this.cell.right) {
                        var sum = this.cell.right.rightSum(ct);
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.right.stone;
                        }
                        sum = this.cell.right.topSum(ct).concat(this.cell.right.bottomSum(ct));
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.right.stone;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return null;
    },

    //往direction方向交换
    exchange: function (direction) {
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            if (direction.x > 0) {
                if (this.cell.right) {
                    Event.dispatchExchangeEvent(this, this.cell.right.stone);
                }
            } else {
                if (this.cell.left) {
                    Event.dispatchExchangeEvent(this, this.cell.left.stone);
                }
            }
        } else {
            if (direction.y > 0) {
                if (this.cell.top) {
                    Event.dispatchExchangeEvent(this, this.cell.top.stone);
                }
            } else {
                if (this.cell.bottom) {
                    Event.dispatchExchangeEvent(this, this.cell.bottom.stone);
                }
            }
        }
    },

    collectMoveCells: function () {
        this._moveCells = this.cell.allMoveCell();
    },

    //move动作：stone移动多个cell后回调callback
    move: function (cells, callback) {
        cells = cells.concat(this._moveCells);
        this._moveCells = [];

        let targetCell = cells[cells.length - 1];

        if (!this.cell.isCommon()) {
            this.cell.stone = null;
        }
        this.cell = targetCell;
        targetCell.stone = this;

        var tween = cc.tween(this.node);
        for (let index = 0; index < cells.length; index++) {
            const cd = cells[index];
            tween.to(0.2, {position: cd.position});
        }
        tween.call(() => {
            callback(this);
        }).start();
    },

    //消除动作：消除后回调callback
    disappear: function (callback) {
        cc.tween(this.node)
            .to(0.2, {scale: 0})
            .call(() => {
                StoneFactory.recycleStone(this);
                callback(this);
            })
            .start()
    },

    //触发特效：触发后回调callback
    triggerEffect: function (callback) {
        //新生成等级stone
        if (this.disappearLink - Cell.lineLimit > 0) {
            let newStone = StoneFactory.createStone(this.type, this.disappearLink - Cell.lineLimit, this.cell);
            newStone.node.scale = 0;

            cc.tween(newStone.node)
                .to(0.2, {scale: 1})
                .call(() => {
                    callback(this);
                })
                .start()
        } else {
            callback(this);
        }
    },

    refresh: function () {
        this.disappearLink = 0;
        this.node.scale = 1;
        this.node.position = this.cell.position;
    },
});
