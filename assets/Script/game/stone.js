var my_event = require("my_event");
var random_util = require("random_util")
var Cell = require("cell")

var Stone = cc.Class({
    extends: cc.Component,

    properties: () => ({
        cell: {
            default: null,
            type: Cell,
            visible: false,
            serializable: false
        },
        type: -1,
        label: cc.Label
    }),

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.width = Cell.size - 4;
        this.node.height = Cell.size - 4;
        this.label.string = this.cell.id;
    },

    start() {

    },

    // update (dt) {},

    //返回横竖直线统计连续的cell
    lineSum: function () {
        var ct = this.type;

        var xSum = this.cell.leftSum(ct).concat(this.cell.rightSum(ct));

        var ySum = this.cell.topSum(ct).concat(this.cell.bottomSum(ct));

        var result = [];

        if (xSum.length >= Cell.lineLimit - 1) {
            result = result.concat(xSum);
        }

        if (ySum.length >= Cell.lineLimit - 1) {
            result = result.concat(ySum);
        }

        if (result.length >= Cell.lineLimit - 1) {
            result.push(this);
        }

        return result;
    },

    //返回尝试移动后能横竖成行的stone
    tryMoveStone: function () {
        var ct = this.type;
        var indexs = ["top", "bottom", "left", "right"];
        random_util.randomArray(indexs);
        for (let index = 0; index < indexs.length; index++) {
            const direction = indexs[index];
            switch (direction) {
                case "top":
                    if (this.cell.top) {
                        var sum = this.cell.top.topSum(ct);
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.top.current;
                        }
                        sum = this.cell.top.leftSum(ct).concat(this.cell.top.rightSum(ct));
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.top.current;
                        }
                    }
                    break;
                case "bottom":
                    if (this.cell.bottom) {
                        var sum = this.cell.bottom.bottomSum(ct);
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.bottom.current;
                        }
                        sum = this.cell.bottom.leftSum(ct).concat(this.cell.bottom.rightSum(ct));
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.bottom.current;
                        }
                    }
                    break;
                case "left":
                    if (this.cell.left) {
                        var sum = this.cell.left.leftSum(ct);
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.left.current;
                        }
                        sum = this.cell.left.topSum(ct).concat(this.cell.left.bottomSum(ct));
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.left.current;
                        }
                    }
                    break;
                case "right":
                    if (this.cell.right) {
                        var sum = this.cell.right.rightSum(ct);
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.right.current;
                        }
                        sum = this.cell.right.topSum(ct).concat(this.cell.right.bottomSum(ct));
                        if (sum.length >= Cell.lineLimit - 1) {
                            return this.cell.right.current;
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
                if (this.cell.right) {
                    my_event.dispatchExchangeEvent(this, this.cell.right.current);
                }
            } else {
                if (this.cell.left) {
                    my_event.dispatchExchangeEvent(this, this.cell.left.current);
                }
            }
        } else {
            if (direction.y > 0) {
                if (this.cell.top) {
                    my_event.dispatchExchangeEvent(this, this.cell.top.current);
                }
            } else {
                if (this.cell.bottom) {
                    my_event.dispatchExchangeEvent(this, this.cell.bottom.current);
                }
            }
        }
    },

    move: function (cells, callback) {
        var tween = cc.tween(this.node);
        for (let index = 0; index < cells.length; index++) {
            const cd = cells[index];
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
        this.node.position = this.cell.position;

        this.type = random_util.randomInt(5);

        switch (this.type) {
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
