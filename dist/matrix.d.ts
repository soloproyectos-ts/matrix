export interface Positionable {
    readonly coordinates: number[];
    readonly length: number;
}
export interface Transformable {
    transform(t: Transformation): Transformable;
}
export declare class Point implements Positionable, Transformable {
    readonly coordinates: number[];
    constructor(...coordinates: number[]);
    readonly length: number;
    transform(t: Transformation): Point;
    toString(): string;
}
export declare class Vector implements Positionable, Transformable {
    readonly coordinates: number[];
    constructor(...coordinates: number[]);
    static createFromPoints(end: Point, start?: Point): Vector;
    readonly length: number;
    multiply(m: Matrix): Vector;
    transform(t: Transformation): Vector;
    opposite(): Vector;
    scale(value: number): Vector;
    sum(vector: Vector): Vector;
    subtract(vector: Vector): Vector;
    norm(): number;
    unit(): Vector;
    toString(): string;
}
export declare class Matrix {
    readonly vectors: Vector[];
    constructor(...vectors: Vector[]);
    readonly width: number;
    readonly height: number;
    scale(value: number): Matrix;
    transpose(): Matrix;
    multiply(m: Matrix): Matrix;
    toString(): string;
}
export declare class SquareMatrix extends Matrix {
    constructor(...vectors: Vector[]);
    scale(value: number): SquareMatrix;
    transpose(): SquareMatrix;
    adjoint(): SquareMatrix;
    determinant(): number;
    inverse(): SquareMatrix;
    private _getCofactor(col, row);
}
export declare class Transformation extends SquareMatrix implements Transformable {
    constructor(...vectors: Vector[]);
    inverse(): Transformation;
    transform(t: Transformation): Transformation;
}
