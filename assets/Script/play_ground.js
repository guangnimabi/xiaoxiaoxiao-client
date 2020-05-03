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
        },
        _lastTouch: cc.Vec2,
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
        this.content.on(cc.Node.EventType.TOUCH_START, function (event) {
            self._lastTouch = self.content.convertToNodeSpaceAR(event.getLocation());
        });
        this.content.on(cc.Node.EventType.TOUCH_END, function (event) {
            direction = self.content.convertToNodeSpaceAR(event.getLocation()).sub(self._lastTouch);
            var cellKey = "" + Math.floor(self._lastTouch.x / 68) + "_" + Math.floor(self._lastTouch.y / 68);
            if (self._cellDatas.hasOwnProperty(cellKey)){
                self._cellDatas[cellKey].exchange(direction);
            }
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