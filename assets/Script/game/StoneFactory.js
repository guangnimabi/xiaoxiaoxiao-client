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
        },

        //在node中创建stone，置入cell
        createStone: function (name, node, cell) {
            if (this._pools.hasOwnProperty(name)) {
                let stone = this._pools[name].getStone();

                stone.cell = cell;
                cell.stone = stone;

                stone.refresh();

                node.addChild(stone.node);

                return stone;
            }
            return null;
        },

        //回收stone，返回空cell
        recycleStone: function (stone) {
            let cell = stone.cell;
            cell.stone = null;
            stone.cell = null;

            let name = stone.type + '_' + stone.level;
            if (this._pools.hasOwnProperty(name)) {
                this._pools[name].recycleStone(stone);
            }

            return cell;
        },
    },
});


