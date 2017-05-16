export interface Positionable {
    readonly coordinates: number[];
    readonly length: number;
}
export declare class Point implements Positionable {
    readonly coordinates: number[];
    constructor(...coordinates: number[]);
    readonly length: number;
    toString(): string;
}
export declare class Vector implements Positionable {
    readonly coordinates: number[];
    constructor(...coordinates: number[]);
    readonly length: number;
    opposite(): Vector;
    scale(value: number): Vector;
    sum(vector: Vector): Vector;
    subtract(vector: Vector): Vector;
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
    adjoint(): Matrix;
    determinant(): number;
    inverse(): Matrix;
    private _getCofactor(col, row);
    toString(): string;
}
