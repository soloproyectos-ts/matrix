export declare class Vector {
    readonly w: Array<number>;
    constructor(...w: Array<number>);
    readonly length: number;
    scale(value: number): Vector;
    readonly opposite: Vector;
    transform(m: Matrix): Vector;
    static sum(v0: Vector, v1: Vector): Vector;
    static sub(v0: Vector, v1: Vector): Vector;
    toString(): string;
}
export declare class Matrix {
    readonly vectors: Array<Vector>;
    constructor(...vectors: Array<Vector>);
    readonly width: number;
    readonly height: number;
    getValue(col: number, row: number): number;
    readonly isSquare: boolean;
    scale(value: number): Matrix;
    getAdjoint(col: number, row: number): Matrix;
    adjoint(): Matrix;
    determinant(): number;
    inverse(): Matrix;
    toString(): string;
}
