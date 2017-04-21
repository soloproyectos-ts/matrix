export declare class Point {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    translate(vector: Vector): Point;
}
export declare class Vector {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    static createFromPoints(p0: Point, p1: Point): Vector;
    readonly opposite: Vector;
    readonly length: number;
    scale(value: number): Vector;
    transform(m: Matrix): Vector;
    static sum(v0: Vector, v1: Vector): Vector;
    static sub(v0: Vector, v1: Vector): Vector;
}
export declare class Matrix {
    readonly vectors: [Vector, Vector];
    constructor(v0: Vector, v1: Vector);
    scale(value: number): Matrix;
    readonly adj: Matrix;
    readonly det: number;
    readonly inverse: Matrix;
}
export declare class Line {
    readonly point: Point;
    readonly vector: Vector;
    constructor(point: Point, vector: Vector);
    getParallel(p: Point): Line;
    getPerpendicular(p: Point): Line;
    static isParallel(l0: Line, l1: Line): boolean;
    static getIntersection(l0: Line, l1: Line): Point;
}
