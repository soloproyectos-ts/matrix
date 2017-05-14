define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vector = (function () {
        function Vector() {
            var w = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                w[_i] = arguments[_i];
            }
            this.w = w;
        }
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                return this.w.length;
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.scale = function (value) {
            return new (Vector.bind.apply(Vector, [void 0].concat(this.w.map(function (w) {
                return value * w;
            }))))();
        };
        Object.defineProperty(Vector.prototype, "opposite", {
            get: function () {
                return new (Vector.bind.apply(Vector, [void 0].concat(this.w.map(function (w) {
                    return -w;
                }))))();
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.transform = function (m) {
            var w = [];
            if (m.width != this.length) {
                throw 'invalid matrix width';
            }
            for (var i = 0; i < m.width; i++) {
                var total = 0;
                for (var j = 0; j < m.vectors.length; j++) {
                    total += m.vectors[j].w[i] * this.w[j];
                }
                w.push(total);
            }
            return new (Vector.bind.apply(Vector, [void 0].concat(w)))();
        };
        Vector.sum = function (v0, v1) {
            if (v0.length != v1.length) {
                throw 'Vectors must have the same size';
            }
            return new (Vector.bind.apply(Vector, [void 0].concat(v0.w.map(function (w, index) {
                return w + v1.w[index];
            }))))();
        };
        Vector.sub = function (v0, v1) {
            return Vector.sum(v0, v1.opposite);
        };
        Vector.prototype.toString = function () {
            return "[" + this.w.join(', ') + "]";
        };
        return Vector;
    }());
    exports.Vector = Vector;
    var Matrix = (function () {
        function Matrix() {
            var vectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vectors[_i] = arguments[_i];
            }
            this.vectors = vectors;
            var height = this.height;
            if (!vectors.every(function (vector) {
                return vector.length == height;
            })) {
                throw 'All vectors must have the same length';
            }
            ;
        }
        Object.defineProperty(Matrix.prototype, "width", {
            get: function () {
                return this.vectors.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix.prototype, "height", {
            get: function () {
                return this.width > 0 ? this.vectors[0].length : 0;
            },
            enumerable: true,
            configurable: true
        });
        Matrix.prototype.getValue = function (col, row) {
            return this.vectors[col].w[row];
        };
        Object.defineProperty(Matrix.prototype, "isSquare", {
            get: function () {
                return this.width == this.height;
            },
            enumerable: true,
            configurable: true
        });
        Matrix.prototype.scale = function (value) {
            return new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.map(function (vector) {
                return vector.scale(value);
            }))))();
        };
        Matrix.prototype.getAdjoint = function (col, row) {
            if (col > this.width - 1 || row > this.width - 1) {
                throw 'Index out of bounds';
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.filter(function (vector, index) {
                return index != col;
            }).map(function (vector, index) {
                return new (Vector.bind.apply(Vector, [void 0].concat(vector.w.filter(function (value, index) {
                    return index != row;
                }))))();
            }))))();
        };
        Matrix.prototype.adjoint = function () {
            if (!this.isSquare) {
                throw 'Not a square matrix';
            }
            return null;
        };
        Matrix.prototype.determinant = function () {
            var self = this;
            var ret = 0;
            if (!this.isSquare) {
                throw 'Not a square matrix';
            }
            if (this.width > 0) {
                var vector = this.vectors[0];
                var initVal = this.width < 2 ? vector.w[0] : 0;
                ret = vector.w.reduce(function (prev, current, index) {
                    var sign = index % 2 > 0 ? -1 : +1;
                    var adj = self.getAdjoint(0, index);
                    return prev + sign * current * adj.determinant();
                }, initVal);
            }
            return ret;
        };
        Matrix.prototype.inverse = function () {
            if (!this.isSquare) {
                throw 'Not a square matrix';
            }
            return null;
        };
        Matrix.prototype.toString = function () {
            return this.vectors.map(function (vector) {
                return vector.toString();
            }).join('\n');
        };
        return Matrix;
    }());
    exports.Matrix = Matrix;
});
