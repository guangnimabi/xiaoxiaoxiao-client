module.exports = cc.Class({
    statics: {

        //随机一个整数x，min<=x<max
        randomInt: function (max, min) {
            if (!min) {
                min = 0;
            }
            return Math.floor(Math.random() * (max - min) + min);
        },

        //随机乱序一个数组里的元素
        randomArray: function (array) {
            for (let i = array.length - 1; i > 0; i--) {
                let lastIndex = i;
                let changeIndex = Math.floor(Math.random() * lastIndex);
                let t = array[lastIndex];
                array[lastIndex] = array[changeIndex];
                array[changeIndex] = t;
            }
        }
    }
});