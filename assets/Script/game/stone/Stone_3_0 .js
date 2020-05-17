var Stone = require('Stone');
var StoneFactory = require('StoneFactory');

cc.Class({
    extends: Stone,

    properties: {

    },

    ctor: function(){
        this.type = StoneFactory.STONE_TYPE_3;
        this.level = 0;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
