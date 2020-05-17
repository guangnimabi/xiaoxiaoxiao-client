var Stone = require('Stone');
var StoneFactory = require('StoneFactory');

cc.Class({
    extends: Stone,

    properties: {

    },

    ctor: function(){
        this.type = StoneFactory.STONE_TYPE_1;
        this.level = 1;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
