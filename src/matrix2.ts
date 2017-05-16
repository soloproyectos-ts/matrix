export class Vector {
  private _coordinates: number[];

  constructor (...coordinates: number[]) {
    this._coordinates = coordinates;
  }

  get coordinates(): number[] {
    return this._coordinates.map((value) => value);
  }

  get length(): number {
    return this._coordinates.length;
  }

  getCoordinate(index: number): number {
    return this._coordinates[index];
  }

  opposite(): Vector {
    return new Vector(...this._coordinates.map(function (w: number) {
      return -w;
    }));
  }

  scale(value: number): Vector {
    return new Vector(...this._coordinates.map(function (w: number) {
      return value * w;
    }));
  }

  sum(vector: Vector): Vector {
    if (this.length != vector.length) {
      throw 'Vectors must have the same size';
    }

    return new Vector(...this._coordinates.map((w: number, index: number) =>
      w + vector._coordinates[index]
    ));
  }

  subtract(vector: Vector): Vector {
    return this.sum(vector.opposite());
  }

  toString(): string {
    return `[${this._coordinates.join(', ')}]`;
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
      let coords = [];
      for (let j = 0; j < width; j++) {
        coords.push(this.vectors[j].getCoordinate(i));
      }
      vectors.push(new Vector(...coords));
    }

    return new Matrix(...vectors);
  }

  multiply(m: Matrix): Matrix {
    if (this.width != m.height) {
      throw 'Invalid matrix multiplication';
    }

    return new Matrix(...this.transpose().vectors.map((v0) =>
      new Vector(...m.vectors.map((v1) =>
        v0.coordinates.reduce((prev, current, k) =>
          prev + current * v1.getCoordinate(k), 0)
      ))
    ));
  }

  adjoint(): Matrix {
    if (this.width != this.height) {
      throw 'Not a square matrix';
    }

    return new Matrix(...this.vectors.map((vector, col) =>
      new Vector(...vector.coordinates.map((value, row) =>
        this._getCofactor(col, row))))).transpose();
  }

  determinant(): number {
    if (this.width != this.height) {
      throw 'Not a square matrix';
    }

    let vector = this.width > 0? this.vectors[0]: new Vector();
    let initVal = this.width > 0? 0: 1;

    return vector.coordinates.reduce(
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
      return new Vector(...vector.coordinates.filter(function (value, index) {
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
