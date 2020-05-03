// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        this.node.position = cc.Vec2(this.cellData.mapData.x + 0.5, this.cellData.mapData.y + 0.5).mulSelf(68);

        do {
            this.cellType = Math.floor(Math.random() * (4 - 0) + 0);
        } while (this.cellData.checkLine());

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

    checkLine: function () {
        if (this.current) {
            var ct = this.current.cellType;
            // cc.log("---------->>>>start bottom:" + this.mapData.x + "_" + this.mapData.y + "_" + ct);
            var lc = this.bottomCount(ct);
            var xCount = 1 + this.leftCount(ct) + this.rightCount(ct);
            var yCount = 1 + this.topCount(ct) + lc;

            // cc.log(">>>>start bottom:" + lc);

            if (xCount >= yCount) {
                return xCount >= 3;
            } else {
                return yCount >= 3;
            }
        }
        return false
    },

    leftCount: function (ct) {
        if (this.left && this.left.current && this.left.current.cellType === ct) {
            return 1 + this.left.leftCount(ct);
        }

        return 0;
    },

    rightCount: function (ct) {
        if (this.right && this.right.current && this.right.current.cellType === ct) {
            return 1 + this.right.rightCount(ct);
        }

        return 0;
    },

    topCount: function (ct) {
        if (this.top && this.top.current && this.top.current.cellType === ct) {
            return 1 + this.top.topCount(ct);
        }

        return 0;
    },

    bottomCount: function (ct) {
        if (this.bottom && this.bottom.current && this.bottom.current.cellType === ct) {
            return 1 + this.bottom.bottomCount(ct);
        }

        return 0;
    },

    exchange: function (direction) {
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            if (direction.x > 0) {
                
            } else {

            }
        } else {
            if (direction.y > 0) {

            } else {

            }
        }
    },
});

module.exports = CellData;
