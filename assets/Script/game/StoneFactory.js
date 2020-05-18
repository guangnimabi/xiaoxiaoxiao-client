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
            return cc.instantiate(this.prefab).getComponent('Stone');
        }
    },

    recycleStone: function (stone) {
        this.pool.put(stone.node);
    },
});

module.exports = cc.Class({
    statics: {
        STONE_TYPE_0: 0,
        STONE_TYPE_1: 1,
        STONE_TYPE_2: 2,
        STONE_TYPE_3: 3,
        STONE_TYPE_4: 4,

        stoneContainer: cc.Node,
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

        //通过stone的type和level确定prefab的key
        getKey: function (stoneType, stoneLevel) {
            let key = stoneType + '_' + stoneLevel;
            if (this._pools.hasOwnProperty(key)) {
                return key;
            } else {
                if (stoneLevel > 0) {
                    return this.getKey(stoneType, stoneLevel - 1);
                } else {
                    return '';
                }
            }
        },

        //在node中创建stone，置入cell
        createStone: function (stoneType, stoneLevel, cell) {
            let key = this.getKey(stoneType, stoneLevel);
            if (key) {
                let stone = this._pools[key].getStone();

                stone.cell = cell;
                cell.stone = stone;

                stone.refresh();

                this.stoneContainer.addChild(stone.node);

                return stone;
            } else {
                return null;
            }
        },

        //回收stone，返回空cell
        recycleStone: function (stone) {
            let cell = stone.cell;
            cell.stone = null;
            //stone.cell = null; //stone的cell不为null，记录石头消失时候的cell
            let name = stone.type + '_' + stone.level;
            if (this._pools.hasOwnProperty(name)) {
                this._pools[name].recycleStone(stone);
            }

            return cell;
        },
    },
});


