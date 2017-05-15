export class Vector {
  readonly w: number[];

  constructor (...w: number[]) {
    this.w = w;
  }

  get length(): number {
    return this.w.length;
  }

  opposite(): Vector {
    return new Vector(...this.w.map(function (w: number) {
      return -w;
    }));
  }

  scale(value: number): Vector {
    return new Vector(...this.w.map(function (w: number) {
      return value * w;
    }));
  }

  static sum(v0: Vector, v1: Vector): Vector {
    if (v0.length != v1.length) {
      throw 'Vectors must have the same size';
    }

    return new Vector(...v0.w.map(function (w: number, index: number) {
      return w + v1.w[index];
    }));
  }

  // TODO: replace sub by subtract
  static sub(v0: Vector, v1: Vector): Vector {
    return Vector.sum(v0, v1.opposite());
  }

  toString(): string {
    return `[${this.w.join(', ')}]`;
  }
}

export class Matrix {
  readonly vectors: Vector[];

  constructor (...vectors: Vector[]) {
    this.vectors = vectors;

    let height = this.height;
    if (!vectors.every(function (vector: Vector): boolean {
      return vector.length == height;
    })) {
      throw 'All vectors must have the same length';
    };
  }

  static multiply(m0: Matrix, m1: Matrix): Matrix {
    if (m0.width != m1.height) {
      throw 'Invalid matrix multiplication';
    }

    return new Matrix(...m0.transpose().vectors.map((v0) =>
      new Vector(...m1.vectors.map((v1) =>
        v0.w.reduce((prev, current, k) => prev + current * v1.w[k], 0)
      ))
    ));
  }

  get width(): number {
    return this.vectors.length;
  }

  get height(): number {
    return this.width > 0? this.vectors[0].length: 0;
  }

  scale(value: number) {
    return new Matrix(...this.vectors.map(function (vector: Vector) {
      return vector.scale(value);
    }));
  }

  transpose(): Matrix {
    let height = this.height;
    let width = this.width;
    let vectors = [];

    for (let i = 0; i < height; i++) {
      let values = [];
      for (let j = 0; j < width; j++) {
        values.push(this.vectors[j].w[i]);
      }
      vectors.push(new Vector(...values));
    }

    return new Matrix(...vectors);
  }

  adjoint(): Matrix {
    if (this.width != this.height) {
      throw 'Not a square matrix';
    }

    return this.width == 1
      ? new Matrix(new Vector(1))
      : new Matrix(...this.vectors.map((vector, col) =>
      new Vector(...vector.w.map((value, row) => this._getCofactor(col, row)))
    )).transpose();
  }

  determinant(): number {
    let vector = this.width > 0? this.vectors[0]: new Vector();
    let initVal = this.width > 0? 0: 1;

    if (this.width != this.height) {
      throw 'Not a square matrix';
    }

    return vector.w.reduce(
      (prev, current, index) => prev + current * this._getCofactor(0, index),
      initVal
    );
  }

  inverse(): Matrix {
    if (this.width != this.height) {
      throw 'Not a square matrix';
    }

    return this.adjoint().scale(1 / this.determinant()) as Matrix;
  }

  toString(): string {
    return this.vectors.map(function (vector: Vector) {
      return vector.toString();
    }).join('\n');
  }

  private _getCofactor(col: number, row: number): number {
    let sign = (col + row) % 2 > 0? -1 : +1;
    let m = new Matrix(...this.vectors.filter(function (vector, index) {
      return index != col;
    }).map(function (vector, index) {
      return new Vector(...vector.w.filter(function (value, index) {
        return index != row;
      }));
    }));

    return sign * m.determinant();
  }
}
