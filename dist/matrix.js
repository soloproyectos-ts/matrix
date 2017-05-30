var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        Point.prototype.transform = function (t) {
            var v = new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.concat([1]))))().multiply(t);
            return new (Point.bind.apply(Point, [void 0].concat(v.coordinates.slice(0, -1))))();
        };
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
        Vector.createFromPoints = function (end, start) {
            return new (Vector.bind.apply(Vector, [void 0].concat(end.coordinates.map(function (w, i) {
                var z = start !== undefined ? start.coordinates[i] : 0;
                return w - z;
            }))))();
        };
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                return this.coordinates.length;
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.multiply = function (m) {
            var _this = this;
            if (m.width != this.length) {
                throw 'The width of the matrix must match the length of the vector';
            }
            return new (Vector.bind.apply(Vector, [void 0].concat(m.transpose().vectors.map(function (vector, index) {
                return vector.coordinates.reduce(function (prev, current, i) {
                    return prev + current * _this.coordinates[i];
                }, 0);
            }))))();
        };
        Vector.prototype.transform = function (t) {
            var v = new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.concat([1]))))().multiply(t);
            return new (Vector.bind.apply(Vector, [void 0].concat(v.coordinates.slice(0, -1))))();
        };
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
                throw 'The vectors must have the same length';
            }
            return new (Vector.bind.apply(Vector, [void 0].concat(this.coordinates.map(function (w, index) {
                return w + vector.coordinates[index];
            }))))();
        };
        Vector.prototype.subtract = function (vector) {
            return this.sum(vector.opposite());
        };
        Vector.prototype.norm = function () {
            return Math.sqrt(this.coordinates.reduce(function (prev, w) {
                return prev + w * w;
            }, 0));
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
            var _this = this;
            if (this.width != m.height) {
                throw 'The width of [this] matrix must match the height of the matrix';
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(m.vectors.map(function (vector) { return vector.multiply(_this); }))))();
        };
        Matrix.prototype.toString = function () {
            return this.vectors.map(function (vector) {
                return vector.toString();
            }).join('\n');
        };
        return Matrix;
    }());
    exports.Matrix = Matrix;
    var SquareMatrix = (function (_super) {
        __extends(SquareMatrix, _super);
        function SquareMatrix() {
            var vectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vectors[_i] = arguments[_i];
            }
            var _this = _super.apply(this, vectors) || this;
            if (_this.width != _this.height) {
                throw 'The width and the height of [this] matrix must match';
            }
            return _this;
        }
        SquareMatrix.prototype.scale = function (value) {
            return new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(_super.prototype.scale.call(this, value).vectors)))();
        };
        SquareMatrix.prototype.transpose = function () {
            return new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(_super.prototype.transpose.call(this).vectors)))();
        };
        SquareMatrix.prototype.adjoint = function () {
            var _this = this;
            return new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(this.vectors.map(function (vector, col) {
                return new (Vector.bind.apply(Vector, [void 0].concat(vector.coordinates.map(function (value, row) {
                    return _this._getCofactor(col, row);
                }))))();
            }))))().transpose();
        };
        SquareMatrix.prototype.determinant = function () {
            var _this = this;
            var vector = this.width > 0 ? this.vectors[0] : new Vector();
            var initVal = this.width > 0 ? 0 : 1;
            return vector.coordinates.reduce(function (prev, current, index) { return prev + current * _this._getCofactor(0, index); }, initVal);
        };
        SquareMatrix.prototype.inverse = function () {
            return this.adjoint().scale(1 / this.determinant());
        };
        SquareMatrix.prototype._getCofactor = function (col, row) {
            var sign = (col + row) % 2 > 0 ? -1 : +1;
            var m = new (SquareMatrix.bind.apply(SquareMatrix, [void 0].concat(this.vectors
                .filter(function (vector, index) { return index != col; })
                .map(function (vector, index) { return new (Vector.bind.apply(Vector, [void 0].concat(vector.coordinates
                .filter(function (value, index) { return index != row; }))))(); }))))();
            return sign * m.determinant();
        };
        return SquareMatrix;
    }(Matrix));
    exports.SquareMatrix = SquareMatrix;
    var Transformation = (function (_super) {
        __extends(Transformation, _super);
        function Transformation() {
            var vectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vectors[_i] = arguments[_i];
            }
            var _this = _super.apply(this, vectors) || this;
            var test = vectors
                .slice(-1)
                .every(function (vector) {
                var lastCoordinate = vector.coordinates.slice(-1)[0];
                return lastCoordinate == 1;
            });
            if (!test) {
                throw 'The last coordinate of the last vector must be 1';
            }
            var test = vectors
                .slice(0, -1)
                .every(function (vector) {
                var lastCoordinate = vector.coordinates.slice(-1)[0];
                return lastCoordinate == 0;
            });
            if (!test) {
                throw 'The last coordinate of the first vectors must be 0';
            }
            return _this;
        }
        Transformation.prototype.inverse = function () {
            var vectors = _super.prototype.inverse.call(this).vectors;
            return new (Transformation.bind.apply(Transformation, [void 0].concat(vectors.slice(0, -1).map(function (vector) {
                return new (Vector.bind.apply(Vector, [void 0].concat(vector.coordinates.slice(0, -1).concat([0]))))();
            }).concat(vectors.slice(-1).map(function (vector) {
                return new (Vector.bind.apply(Vector, [void 0].concat(vector.coordinates.slice(0, -1).concat([1]))))();
            })))))();
        };
        Transformation.prototype.transform = function (t) {
            return new (Transformation.bind.apply(Transformation, [void 0].concat(t.multiply(this).vectors)))();
        };
        return Transformation;
    }(SquareMatrix));
    exports.Transformation = Transformation;
});
