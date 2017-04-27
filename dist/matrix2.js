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
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.translate = function (vector) {
            return new Point(this.x + vector.x, this.y + vector.y);
        };
        return Point;
    }());
    exports.Point = Point;
    var Vector = (function () {
        function Vector(x, y) {
            _a = [x, y], this.x = _a[0], this.y = _a[1];
            var _a;
        }
        Vector.createFromPoints = function (p0, p1) {
            var v0 = new Vector(p0.x, p0.y);
            var v1 = new Vector(p1.x, p1.y);
            return Vector.sub(v0, v1);
        };
        Object.defineProperty(Vector.prototype, "opposite", {
            get: function () {
                return new Vector(-this.x, -this.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.scale = function (value) {
            return new Vector(value * this.x, value * this.y);
        };
        Vector.prototype.transform = function (m) {
            var _a = m.vectors, v0 = _a[0], v1 = _a[1];
            return new Vector(v0.x * this.x + v1.x * this.y, v0.y * this.x + v1.y * this.y);
        };
        Vector.sum = function (v0, v1) {
            return new Vector(v0.x + v1.x, v0.y + v1.y);
        };
        Vector.sub = function (v0, v1) {
            return Vector.sum(v1, v0.opposite);
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
        }
        Matrix.prototype.scale = function (value) {
            var vectors = [];
            for (var _i = 0, _a = this.vectors; _i < _a.length; _i++) {
                var vector = _a[_i];
                vectors.push(vector.scale(value));
            }
            return new (Matrix.bind.apply(Matrix, [void 0].concat(vectors)))();
        };
        return Matrix;
    }());
    exports.Matrix = Matrix;
    var SquareMatrix = (function (_super) {
        __extends(SquareMatrix, _super);
        function SquareMatrix(v0, v1) {
            return _super.call(this, v0, v1) || this;
        }
        Object.defineProperty(SquareMatrix.prototype, "adj", {
            get: function () {
                var _a = this.vectors, v0 = _a[0], v1 = _a[1];
                return new SquareMatrix(new Vector(v1.y, -v0.y), new Vector(-v1.x, v0.x));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SquareMatrix.prototype, "det", {
            get: function () {
                var _a = this.vectors, v0 = _a[0], v1 = _a[1];
                return v0.x * v1.y - v1.x * v0.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SquareMatrix.prototype, "inverse", {
            get: function () {
                return this.adj.scale(1 / this.det);
            },
            enumerable: true,
            configurable: true
        });
        return SquareMatrix;
    }(Matrix));
    exports.SquareMatrix = SquareMatrix;
    var Line = (function () {
        function Line(point, vector) {
            this.point = point;
            this.vector = vector;
        }
        Line.prototype.getParallel = function (p) {
            return new Line(p, this.vector);
        };
        Line.prototype.getPerpendicular = function (p) {
            return new Line(p, new Vector(-this.vector.y, this.vector.x));
        };
        Line.isParallel = function (l0, l1) {
            var v0 = l0.vector;
            var v1 = l1.vector;
            return v0.x * v1.y == v1.x * v0.y;
        };
        Line.getIntersection = function (l0, l1) {
            var m = new SquareMatrix(l0.vector, l1.vector.opposite);
            var v = Vector.createFromPoints(l0.point, l1.point);
            var w = v.transform(m.inverse);
            return l1.point.translate(l1.vector.scale(w.y));
        };
        return Line;
    }());
    exports.Line = Line;
});
