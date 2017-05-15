export declare class Vector {
    readonly w: Array<number>;
    constructor(...w: Array<number>);
    readonly length: number;
    readonly opposite: Vector;
    scale(value: number): Vector;
    static sum(v0: Vector, v1: Vector): Vector;
    static sub(v0: Vector, v1: Vector): Vector;
    toString(): string;
}
export declare class Matrix {
    readonly vectors: Array<Vector>;
    constructor(...vectors: Array<Vector>);
    readonly width: number;
    readonly height: number;
    scale(value: number): Matrix;
    transpose(): Matrix;
    adjoint(): Matrix;
    determinant(): number;
    inverse(): Matrix;
    toString(): string;
    private _getCofactor(col, row);
}
