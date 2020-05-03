// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Map = require("./data/map");
var CellData = require("../resources/Script/cell")

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        }

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

        var cellDatas = {};

        var mapData = Map.getMapData();
        for (const key in mapData) {
            const element = mapData[key];

            var cellData = new CellData();
            cellData.mapData = element;
            cellDatas[key] = cellData;
        }

        for (const key in cellDatas) {

            const cellData = cellDatas[key];
            if (cellData.mapData.next && cellDatas.hasOwnProperty(cellData.mapData.next)) {
                cellData.next = cellDatas[cellData.mapData.next];
            }
            if (cellData.mapData.top && cellDatas.hasOwnProperty(cellData.mapData.top)) {
                cellData.top = cellDatas[cellData.mapData.top];
            }
            if (cellData.mapData.bottom && cellDatas.hasOwnProperty(cellData.mapData.bottom)) {
                cellData.bottom = cellDatas[cellData.mapData.bottom];
            }
            if (cellData.mapData.left && cellDatas.hasOwnProperty(cellData.mapData.left)) {
                cellData.left = cellDatas[cellData.mapData.left];
            }
            if (cellData.mapData.right && cellDatas.hasOwnProperty(cellData.mapData.right)) {
                cellData.right = cellDatas[cellData.mapData.right];
            }

        }

        cc.loader.loadRes("prefab/cell", function (err, prefab) {

            for (const key in cellDatas) {
                const cellData = cellDatas[key];

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