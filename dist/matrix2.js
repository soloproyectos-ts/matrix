define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Point = (function () {
        function Point() {
            var coordinates = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                coordinates[_i] = arguments[_i];
            }
            this.coordinates = coordinates;
        }
        Object.defineProperty(Point.prototype, "length", {
            get: function () {
                return this.coordinates.length;
            },
            enumerable: true,
            configurable: true
        });
        Point.prototype.toString = function () {
            return "[" + this.coordinates.join(', ') + "]";
        };
        return Point;
    }());
    exports.Point = Point;
    var Vector = (function () {
        function Vector() {
            var coordinates = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                coordinates[_i] = arguments[_i];
            }
            this.coordinates = coordinates;
        }
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                return this.coordinates.length;
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.opposite = function () {
            return new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.map(function (w) {
                return -w;
            }))))();
        };
        Vector.prototype.scale = function (value) {
            return new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.map(function (w) {
                return value * w;
            }))))();
        };
        Vector.prototype.sum = function (vector) {
            if (this.length != vector.length) {
                throw 'Vectors must have the same size';
            }
            return new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.map(function (w, index) {
                return w + vector.coordinates[index];
            }))))();
        };
        Vector.prototype.subtract = function (vector) {
            return this.sum(vector.opposite());
        };
        Vector.prototype.toString = function () {
            return "[" + this.coordinates.join(', ') + "]";
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
            var height = this.height;
            var width = this.width;
            var vectors = [];
            for (var i = 0; i < height; i++) {
                var coords = [];
                for (var j = 0; j < width; j++) {
                    coords.push(this.vectors[j].coordinates[i]);
                }
                vectors.push(new (Vector.bind.apply(Vector, [void 0].concat(coords)))());
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(vectors)))();
        };
        Matrix.prototype.multiply = function (m) {
            if (this.width != m.height) {
                throw 'Invalid matrix multiplication';
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(this.transpose().vectors.map(function (v0) {
                return new (Vector.bind.apply(Vector, [void 0].concat(m.vectors.map(function (v1) {
                    return v0.coordinates.reduce(function (prev, current, i) {
                        return prev + current * v1.coordinates[i];
                    }, 0);
                }))))();
            }))))();
        };
        Matrix.prototype.adjoint = function () {
            var _this = this;
            if (this.width != this.height) {
                throw 'Not a square matrix';
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.map(function (vector, col) {
                return new (Vector.bind.apply(Vector, [void 0].concat(vector.coordinates.map(function (value, row) {
                    return _this._getCofactor(col, row);
                }))))();
            }))))().transpose();
        };
        Matrix.prototype.determinant = function () {
            var _this = this;
            if (this.width != this.height) {
                throw 'Not a square matrix';
            }
            var vector = this.width > 0 ? this.vectors[0] : new Vector();
            var initVal = this.width > 0 ? 0 : 1;
            return vector.coordinates.reduce(function (prev, current, index) { return prev + current * _this._getCofactor(0, index); }, initVal);
        };
        Matrix.prototype.inverse = function () {
            return this.adjoint().scale(1 / this.determinant());
        };
        Matrix.prototype._getCofactor = function (col, row) {
            var sign = (col + row) % 2 > 0 ? -1 : +1;
            var m = new (Matrix.bind.apply(Matrix, [void 0].concat(this.vectors.filter(function (vector, index) {
                return index != col;
            }).map(function (vector, index) {
                return new (Vector.bind.apply(Vector, [void 0].concat(vector.coordinates.filter(function (value, index) {
                    return index != row;
                }))))();
            }))))();
            return sign * m.determinant();
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
