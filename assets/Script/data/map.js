
module.exports = cc.Class({
    statics: {
        getMapData: function () {
            return JSON.parse(JSON.stringify(map_6_6));
        }
    }
});

var map_6_6 = {
    "1_1": {
        "x": 1,
        "y": 1,
        "last": "1_2",
        "next": "",
        "top": "1_2",
        "bottom": "",
        "left": "",
        "right": "2_1"
    },
    "1_2": {
        "x": 1,
        "y": 2,
        "last": "1_3",
        "next": "1_1",
        "top": "1_3",
        "bottom": "1_1",
        "left": "",
        "right": "2_2"
    },
    "1_3": {
        "x": 1,
        "y": 3,
        "last": "1_4",
        "next": "1_2",
        "top": "1_4",
        "bottom": "1_2",
        "left": "",
        "right": "2_3"
    },
    "1_4": {
        "x": 1,
        "y": 4,
        "last": "1_5",
        "next": "1_3",
        "top": "1_5",
        "bottom": "1_3",
        "left": "",
        "right": "2_4"
    },
    "1_5": {
        "x": 1,
        "y": 5,
        "last": "1_6",
        "next": "1_4",
        "top": "1_6",
        "bottom": "1_4",
        "left": "",
        "right": "2_5"
    },
    "1_6": {
        "x": 1,
        "y": 6,
        "last": "",
        "next": "1_5",
        "top": "",
        "bottom": "1_5",
        "left": "",
        "right": "2_6"
    },
    "2_1": {
        "x": 2,
        "y": 1,
        "last": "2_2",
        "next": "",
        "top": "2_2",
        "bottom": "",
        "left": "1_1",
        "right": "3_1"
    },
    "2_2": {
        "x": 2,
        "y": 2,
        "last": "2_3",
        "next": "2_1",
        "top": "2_3",
        "bottom": "2_1",
        "left": "1_2",
        "right": "3_2"
    },
    "2_3": {
        "x": 2,
        "y": 3,
        "last": "2_4",
        "next": "2_2",
        "top": "2_4",
        "bottom": "2_2",
        "left": "1_3",
        "right": "3_3"
    },
    "2_4": {
        "x": 2,
        "y": 4,
        "last": "2_5",
        "next": "2_3",
        "top": "2_5",
        "bottom": "2_3",
        "left": "1_4",
        "right": "3_4"
    },
    "2_5": {
        "x": 2,
        "y": 5,
        "last": "2_6",
        "next": "2_4",
        "top": "2_6",
        "bottom": "2_4",
        "left": "1_5",
        "right": "3_5"
    },
    "2_6": {
        "x": 2,
        "y": 6,
        "last": "",
        "next": "2_5",
        "top": "",
        "bottom": "2_5",
        "left": "1_6",
        "right": "3_6"
    },
    "3_1": {
        "x": 3,
        "y": 1,
        "last": "3_2",
        "next": "",
        "top": "3_2",
        "bottom": "",
        "left": "2_1",
        "right": "4_1"
    },
    "3_2": {
        "x": 3,
        "y": 2,
        "last": "3_3",
        "next": "3_1",
        "top": "3_3",
        "bottom": "3_1",
        "left": "2_2",
        "right": "4_2"
    },
    "3_3": {
        "x": 3,
        "y": 3,
        "last": "3_4",
        "next": "3_2",
        "top": "3_4",
        "bottom": "3_2",
        "left": "2_3",
        "right": "4_3"
    },
    "3_4": {
        "x": 3,
        "y": 4,
        "last": "3_5",
        "next": "3_3",
        "top": "3_5",
        "bottom": "3_3",
        "left": "2_4",
        "right": "4_4"
    },
    "3_5": {
        "x": 3,
        "y": 5,
        "last": "3_6",
        "next": "3_4",
        "top": "3_6",
        "bottom": "3_4",
        "left": "2_5",
        "right": "4_5"
    },
    "3_6": {
        "x": 3,
        "y": 6,
        "last": "",
        "next": "3_5",
        "top": "",
        "bottom": "3_5",
        "left": "2_6",
        "right": "4_6"
    },
    "4_1": {
        "x": 4,
        "y": 1,
        "last": "4_2",
        "next": "",
        "top": "4_2",
        "bottom": "",
        "left": "3_1",
        "right": "5_1"
    },
    "4_2": {
        "x": 4,
        "y": 2,
        "last": "4_3",
        "next": "4_1",
        "top": "4_3",
        "bottom": "4_1",
        "left": "3_2",
        "right": "5_2"
    },
    "4_3": {
        "x": 4,
        "y": 3,
        "last": "4_4",
        "next": "4_2",
        "top": "4_4",
        "bottom": "4_2",
        "left": "3_3",
        "right": "5_3"
    },
    "4_4": {
        "x": 4,
        "y": 4,
        "last": "4_5",
        "next": "4_3",
        "top": "4_5",
        "bottom": "4_3",
        "left": "3_4",
        "right": "5_4"
    },
    "4_5": {
        "x": 4,
        "y": 5,
        "last": "4_6",
        "next": "4_4",
        "top": "4_6",
        "bottom": "4_4",
        "left": "3_5",
        "right": "5_5"
    },
    "4_6": {
        "x": 4,
        "y": 6,
        "last": "",
        "next": "4_5",
        "top": "",
        "bottom": "4_5",
        "left": "3_6",
        "right": "5_6"
    },
    "5_1": {
        "x": 5,
        "y": 1,
        "last": "5_2",
        "next": "",
        "top": "5_2",
        "bottom": "",
        "left": "4_1",
        "right": "6_1"
    },
    "5_2": {
        "x": 5,
        "y": 2,
        "last": "5_3",
        "next": "5_1",
        "top": "5_3",
        "bottom": "5_1",
        "left": "4_2",
        "right": "6_2"
    },
    "5_3": {
        "x": 5,
        "y": 3,
        "last": "5_4",
        "next": "5_2",
        "top": "5_4",
        "bottom": "5_2",
        "left": "4_3",
        "right": "6_3"
    },
    "5_4": {
        "x": 5,
        "y": 4,
        "last": "5_5",
        "next": "5_3",
        "top": "5_5",
        "bottom": "5_3",
        "left": "4_4",
        "right": "6_4"
    },
    "5_5": {
        "x": 5,
        "y": 5,
        "last": "5_6",
        "next": "5_4",
        "top": "5_6",
        "bottom": "5_4",
        "left": "4_5",
        "right": "6_5"
    },
    "5_6": {
        "x": 5,
        "y": 6,
        "last": "",
        "next": "5_5",
        "top": "",
        "bottom": "5_5",
        "left": "4_6",
        "right": "6_6"
    },
    "6_1": {
        "x": 6,
        "y": 1,
        "last": "6_2",
        "next": "",
        "top": "6_2",
        "bottom": "",
        "left": "5_1",
        "right": ""
    },
    "6_2": {
        "x": 6,
        "y": 2,
        "last": "6_3",
        "next": "6_1",
        "top": "6_3",
        "bottom": "6_1",
        "left": "5_2",
        "right": ""
    },
    "6_3": {
        "x": 6,
        "y": 3,
        "last": "6_4",
        "next": "6_2",
        "top": "6_4",
        "bottom": "6_2",
        "left": "5_3",
        "right": ""
    },
    "6_4": {
        "x": 6,
        "y": 4,
        "last": "6_5",
        "next": "6_3",
        "top": "6_5",
        "bottom": "6_3",
        "left": "5_4",
        "right": ""
    },
    "6_5": {
        "x": 6,
        "y": 5,
        "last": "6_6",
        "next": "6_4",
        "top": "6_6",
        "bottom": "6_4",
        "left": "5_5",
        "right": ""
    },
    "6_6": {
        "x": 6,
        "y": 6,
        "last": "",
        "next": "6_5",
        "top": "",
        "bottom": "6_5",
        "left": "5_6",
        "right": ""
    }
};