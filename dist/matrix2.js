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
        Object.defineProperty(Vector.prototype, "opposite", {
            get: function () {
                return new (Vector.bind.apply(Vector, [void 0].concat(this.w.map(function (w) {
                    return -w;
                }))))();
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.scale = function (value) {
            return new (Vector.bind.apply(Vector, [void 0].concat(this.w.map(function (w) {
                return value * w;
            }))))();
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
        Matrix.prototype.scale = function (value) {
            return new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.map(function (vector) {
                return vector.scale(value);
            }))))();
        };
        Matrix.prototype.transpose = function () {
            var _this = this;
            if (this.width != this.height) {
                throw 'Not a square matrix';
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.map(function (vector, col) {
                return new (Vector.bind.apply(Vector, [void 0].concat(vector.w.map(function (number, row) { return _this.vectors[row].w[col]; }))))();
            }))))();
        };
        Matrix.prototype.adjoint = function () {
            var _this = this;
            if (this.width != this.height) {
                throw 'Not a square matrix';
            }
            return this.width == 1
                ? new Matrix(new Vector(1))
                : new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.map(function (vector, col) {
                    return new (Vector.bind.apply(Vector, [void 0].concat(vector.w.map(function (value, row) { return _this._getCofactor(col, row); }))))();
                }))))().transpose();
        };
        Matrix.prototype.determinant = function () {
            var _this = this;
            var vector = this.width > 0 ? this.vectors[0] : new Vector();
            var initVal = this.width > 0 ? 0 : 1;
            if (this.width != this.height) {
                throw 'Not a square matrix';
            }
            return vector.w.reduce(function (prev, current, index) { return prev + current * _this._getCofactor(0, index); }, initVal);
        };
        Matrix.prototype.inverse = function () {
            if (this.width != this.height) {
                throw 'Not a square matrix';
            }
            return this.adjoint().scale(1 / this.determinant());
        };
        Matrix.prototype.toString = function () {
            return this.vectors.map(function (vector) {
                return vector.toString();
            }).join('\n');
        };
        Matrix.prototype._getCofactor = function (col, row) {
            var sign = (col + row) % 2 > 0 ? -1 : +1;
            var m = new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.filter(function (vector, index) {
                return index != col;
            }).map(function (vector, index) {
                return new (Vector.bind.apply(Vector, [void 0].concat(vector.w.filter(function (value, index) {
                    return index != row;
                }))))();
            }))))();
            return sign * m.determinant();
        };
        return Matrix;
    }());
    exports.Matrix = Matrix;
});
