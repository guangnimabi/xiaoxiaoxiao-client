var RandomUtil = require("RandomUtil");

var StonePool = cc.Class({
    properties: {
        prefab: cc.Prefab,
        pool: cc.NodePool,
    },

    getStone: function () {
        if (this.pool.size() > 0) {
            return this.pool.get().getComponent('Stone');
        } else {
            return cc.instantiate(this.prefab).getComponent("Stone");
        }
    },

    recycleStone: function (stone) {
        this.pool.put(stone.node);
    },
});

module.exports = cc.Class({
    statics: {
        _pools: {}, //{type_level:{StonePool}}

        addStonePrefab: function (prefab) {
            var stonePool = new StonePool();
            stonePool.prefab = prefab;
            stonePool.pool = new cc.NodePool();

            this._pools[prefab.name] = stonePool;
        },

        randomStoneType: function () {
            return RandomUtil.randomInt(5);

            // switch (this.type) {
            //     case 0:
            //         this.node.color = cc.Color.RED;
            //         break;
            //     case 1:
            //         this.node.color = cc.Color.GREEN;
            //         break;
            //     case 2:
            //         this.node.color = cc.Color.BLUE;
            //         break;
            //     case 3:
            //         this.node.color = cc.Color.YELLOW;
            //         break;
            //     case 4:
            //         this.node.color = cc.Color.MAGENTA;
            //         break;
            //     case 5:
            //         this.node.color = cc.Color.CYAN;
            //         break;
            //     case 6:
            //         this.node.color = cc.Color.ORANGE;
            //         break;
            //     case 7:
            //         this.node.color = cc.Color.WHITE;
            //         break;
            //     default:
            //         this.node.color = cc.Color.BLACK;
            //         break;
            // }
        },

        getStone: function (name) {
            if (this._pools.hasOwnProperty(name)) {
                return this._pools[name].getStone();
            }
            return null;
        },

        recycleStone: function (stone) {
            var name = stone.type + '_' + stone.level;
            if (this._pools.hasOwnProperty(name)) {
                this._pools[name].recycleStone(stone);
            }
        },
    },
});


