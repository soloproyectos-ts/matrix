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

  sum(vector: Vector): Vector {
    if (this.length != vector.length) {
      throw 'Vectors must have the same size';
    }

    return new Vector(...this.w.map(function (w: number, index: number) {
      return w + vector.w[index];
    }));
  }

  subtract(vector: Vector): Vector {
    return this.sum(vector.opposite());
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

  multiply(m: Matrix): Matrix {
    if (this.width != m.height) {
      throw 'Invalid matrix multiplication';
    }

    return new Matrix(...this.transpose().vectors.map((v0) =>
      new Vector(...m.vectors.map((v1) =>
        v0.w.reduce((prev, current, k) => prev + current * v1.w[k], 0)
      ))
    ));
  }

  adjoint(): Matrix {
    if (this.width != this.height) {
      throw 'Not a square matrix';
    }

    return new Matrix(...this.vectors.map((vector, col) =>
      new Vector(...vector.w.map((value, row) =>
        this._getCofactor(col, row))))).transpose();
  }

  determinant(): number {
    if (this.width != this.height) {
      throw 'Not a square matrix';
    }

    let vector = this.width > 0? this.vectors[0]: new Vector();
    let initVal = this.width > 0? 0: 1;
    
    return vector.w.reduce(
      (prev, current, index) => prev + current * this._getCofactor(0, index),
      initVal
    );
  }

  inverse(): Matrix {
    return  this.adjoint().scale(1 / this.determinant());
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

  toString(): string {
    return this.vectors.map(function (vector: Vector) {
      return vector.toString();
    }).join('\n');
  }
}
