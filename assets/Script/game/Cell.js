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

    //返回除自身外，横竖直线统计连续的stone
    lineSum: function (st) {
        var xSum = this.leftSum(st).concat(this.rightSum(st));

        var ySum = this.topSum(st).concat(this.bottomSum(st));

        var result = [];

        if (xSum.length >= Cell.lineLimit - 1) {
            result = result.concat(xSum);
        }

        if (ySum.length >= Cell.lineLimit - 1) {
            result = result.concat(ySum);
        }

        return result;
    },

    leftSum: function (st) {
        if (this.left && this.left.stone && this.left.stone.type === st) {
            return [this.left.stone].concat(this.left.leftSum(st));
        }

        return [];
    },

    rightSum: function (st) {
        if (this.right && this.right.stone && this.right.stone.type === st) {
            return [this.right.stone].concat(this.right.rightSum(st));
        }

        return [];
    },

    topSum: function (st) {
        if (this.top && this.top.stone && this.top.stone.type === st) {
            return [this.top.stone].concat(this.top.topSum(st));
        }

        return [];
    },

    bottomSum: function (st) {
        if (this.bottom && this.bottom.stone && this.bottom.stone.type === st) {
            return [this.bottom.stone].concat(this.bottom.bottomSum(st));
        }

        return [];
    },

    //返回当前cell之前的所有content
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

    //返回当前cell之后可移动的cell
    allMoveCell: function () {
        let moveCells = [];
        let currentCell = this;
        for (let i = this.countNextEmpty(); i > 0; i--) {
            moveCells.push(currentCell.next);
            currentCell = currentCell.next;
        }
        return moveCells;
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

    //返回所有next的空cell个数(包含born cell)
    countNextEmpty: function () {
        if (this.next) {
            if (this.next.stone) {
                return 0 + this.next.countNextEmpty();
            } else {
                return 1 + this.next.countNextEmpty();
            }
        } else {
            return 0;
        }
    },
});

module.exports = Cell;