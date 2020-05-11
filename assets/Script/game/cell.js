const CELL_TYPE_COMMON = 0;
const CELL_TYPE_BORN = 1;

var Cell = cc.Class({
    statics: {
        size: 68,
        lineLimit: 5,
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

        getAllCellContent: function () {
            var allCellContents = [];
            for (const id in this._cells) {
                const cell = this._cells[id];
                if (cell.current) {
                    allCellContents.push(cell.current);
                }
            }
            return allCellContents;
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
        type: 0,
        current: null,
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
        if (this.left && this.left.current && this.left.current.type === ct) {
            return [this.left.current].concat(this.left.leftSum(ct));
        }

        return [];
    },

    rightSum: function (ct) {
        if (this.right && this.right.current && this.right.current.type === ct) {
            return [this.right.current].concat(this.right.rightSum(ct));
        }

        return [];
    },

    topSum: function (ct) {
        if (this.top && this.top.current && this.top.current.type === ct) {
            return [this.top.current].concat(this.top.topSum(ct));
        }

        return [];
    },

    bottomSum: function (ct) {
        if (this.bottom && this.bottom.current && this.bottom.current.type === ct) {
            return [this.bottom.current].concat(this.bottom.bottomSum(ct));
        }

        return [];
    },

    //返回当前cell之前的所有content
    allLastContent: function () {
        if (this.last) {
            if (this.last.current) {
                return [this.last.current].concat(this.last.allLastContent());
            } else {
                return this.last.allLastContent();
            }
        } else {
            return [];
        }
    },

    //返回当前cell之后可移动的空闲cell
    allMoveCell: function () {
        if (this.next && !this.next.current) {
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
            if (this.current) {
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