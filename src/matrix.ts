export interface Positionable {
  readonly coordinates: number[];
  readonly length: number;
}

export class Point implements Positionable {
  readonly coordinates: number[];

  constructor (...coordinates: number[]) {
    this.coordinates = coordinates;
  }

  get length(): number {
    return this.coordinates.length;
  }

  toString(): string {
    return `[${this.coordinates.join(', ')}]`;
  }
}

export class Vector implements Positionable {
  readonly coordinates: number[];

  constructor (...coordinates: number[]) {
    this.coordinates = coordinates;
  }

  get length(): number {
    return this.coordinates.length;
  }

  opposite(): Vector {
    return new Vector(...this.coordinates.map(function (w: number) {
      return -w;
    }));
  }

  scale(value: number): Vector {
    return new Vector(...this.coordinates.map(function (w: number) {
      return value * w;
    }));
  }

  sum(vector: Vector): Vector {
    if (this.length != vector.length) {
      throw 'Vectors must have the same size';
    }

    return new Vector(...this.coordinates.map((w: number, index: number) =>
      w + vector.coordinates[index]
    ));
  }

  subtract(vector: Vector): Vector {
    return this.sum(vector.opposite());
  }

  toString(): string {
    return `[${this.coordinates.join(', ')}]`;
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

  scale(value: number): Matrix {
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
        coords.push(this.vectors[j].coordinates[i]);
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
        v0.coordinates.reduce((prev, current, i) =>
          prev + current * v1.coordinates[i], 0)
      ))
    ));
  }

  toString(): string {
    return this.vectors.map(function (vector: Vector) {
      return vector.toString();
    }).join('\n');
  }
}

export class SquareMatrix extends Matrix {
  constructor (...vectors: Vector[]) {
    super(...vectors);

    if (this.width != this.height) {
      throw 'Not a square matrix';
    }
  }

  static createFromMatrix(m: Matrix): SquareMatrix {
    return new SquareMatrix(...m.vectors);
  }

  scale(value: number): SquareMatrix {
    return SquareMatrix.createFromMatrix(super.scale(value));
  }

  transpose(): SquareMatrix {
    return SquareMatrix.createFromMatrix(super.transpose());
  }

  adjoint(): SquareMatrix {
    return new SquareMatrix(...this.vectors.map((vector, col) =>
      new Vector(...vector.coordinates.map((value, row) =>
        this._getCofactor(col, row))))).transpose();
  }

  determinant(): number {
    let vector = this.width > 0? this.vectors[0]: new Vector();
    let initVal = this.width > 0? 0: 1;

    return vector.coordinates.reduce(
      (prev, current, index) => prev + current * this._getCofactor(0, index),
      initVal
    );
  }

  inverse(): SquareMatrix {
    return  this.adjoint().scale(1 / this.determinant());
  }

  private _getCofactor(col: number, row: number): number {
    let sign = (col + row) % 2 > 0? -1 : +1;
    let m = new SquareMatrix(...this.vectors.filter(function (vector, index) {
      return index != col;
    }).map(function (vector, index) {
      return new Vector(...vector.coordinates.filter(function (value, index) {
        return index != row;
      }));
    }));

    return sign * m.determinant();
  }
}
