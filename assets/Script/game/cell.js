const CELL_TYPE_COMMON = 0;
const CELL_TYPE_BORN = 1;

var Cell = cc.Class({
    statics: {
        size: 68,
        lineLimit: 3,
        _cells: null, //{cellId:{cell}}

        initByMapData: function (mapData) {
            if (!this._cells) {
                this._cells = {};
            }

            //生成所有cell
            for (const k in mapData) {
                var v = mapData[k];
                this.generateCell(cc.v3(v.x, v.y, 0), v.type);
            }

            //创建各个cell关联关系
            for (const k in mapData) {
                var v = mapData[k];
                const cell = this._cells[k];
                if (v.last && this._cells.hasOwnProperty(v.last)) {
                    cell.last = this._cells[v.last];
                }
                if (v.next && this._cells.hasOwnProperty(v.next)) {
                    cell.next = this._cells[v.next];
                }
                if (v.top && this._cells.hasOwnProperty(v.top)) {
                    cell.top = this._cells[v.top];
                }
                if (v.bottom && this._cells.hasOwnProperty(v.bottom)) {
                    cell.bottom = this._cells[v.bottom];
                }
                if (v.left && this._cells.hasOwnProperty(v.left)) {
                    cell.left = this._cells[v.left];
                }
                if (v.right && this._cells.hasOwnProperty(v.right)) {
                    cell.right = this._cells[v.right];
                }
                if (v.born && this._cells.hasOwnProperty(v.born)) {
                    cell.born = this._cells[v.born];
                }
            }
        },

        getCellById: function (id) {
            if (this._cells.hasOwnProperty(id)) {
                return this._cells[id];
            }
            return null;
        },

        getAllStones: function () {
            var allStones = [];
            for (const id in this._cells) {
                const cell = this._cells[id];
                if (cell.stone) {
                    allStones.push(cell.stone);
                }
            }
            return allStones;
        },

        generateCell: function (position, type) {
            var cell = new Cell();
            cell._position = position;
            cell.type = type;

            this._cells[cell.id] = cell;
            return cell;
        },
    },

    properties: {
        type: 0,
        stone: null,
        _position: cc.Vec3,
        id: {
            get: function () {
                if (this._position) {
                    return this._position.x + "_" + this._position.y + "_" + this._position.z;
                }

                return "";
            }
        },
        position: {
            get: function () {
                return this._position.add(cc.v3(0.5, 0.5, 0)).mul(Cell.size);
            }
        },
        last: {
            default: null,
            type: Cell
        },
        next: {
            default: null,
            type: Cell
        },
        top: {
            default: null,
            type: Cell
        },
        bottom: {
            default: null,
            type: Cell
        },
        left: {
            default: null,
            type: Cell
        },
        right: {
            default: null,
            type: Cell
        },
        born: {
            default: null,
            type: Cell
        },
    },

    isCommon: function () {
        return this.type === CELL_TYPE_COMMON;
    },

    leftSum: function (ct) {
        if (this.left && this.left.stone && this.left.stone.type === ct) {
            return [this.left.stone].concat(this.left.leftSum(ct));
        }

        return [];
    },

    rightSum: function (ct) {
        if (this.right && this.right.stone && this.right.stone.type === ct) {
            return [this.right.stone].concat(this.right.rightSum(ct));
        }

        return [];
    },

    topSum: function (ct) {
        if (this.top && this.top.stone && this.top.stone.type === ct) {
            return [this.top.stone].concat(this.top.topSum(ct));
        }

        return [];
    },

    bottomSum: function (ct) {
        if (this.bottom && this.bottom.stone && this.bottom.stone.type === ct) {
            return [this.bottom.stone].concat(this.bottom.bottomSum(ct));
        }

        return [];
    },

    //返回当前cell之前的所有stone
    allLastStones: function () {
        if (this.last) {
            if (this.last.stone) {
                return [this.last.stone].concat(this.last.allLastStones());
            } else {
                return this.last.allLastStones();
            }
        } else {
            return [];
        }
    },

    //返回当前cell之后可移动的空闲cell
    allMoveCell: function () {
        if (this.next && !this.next.stone) {
            return [this.next].concat(this.next.allMoveCell());
        } else {
            return [];
        }
    },

    //返回重新出生的cell
    findBorn: function () {
        if (this.born) {
            return this.born.findBorn();
        } else {
            if (this.stone) {
                return this.last.findBorn();
            } else {
                if (!this.last) {
                    var lastCell = Cell.generateCell(this._position.sub(cc.v3(0, 0, 1)), CELL_TYPE_BORN);
                    lastCell.next = this;
                    this.last = lastCell;
                }
                return this;
            }
        }
    },
});

module.exports = Cell;