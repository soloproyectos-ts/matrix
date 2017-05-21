export interface Positionable {
  readonly coordinates: number[];
  readonly length: number;
}

export interface Transformable {
  transform(t: Transformation): Transformable;
}

export class Point implements Positionable, Transformable {
  readonly coordinates: number[];

  constructor (...coordinates: number[]) {
    this.coordinates = coordinates;
  }

  get length(): number {
    return this.coordinates.length;
  }

  transform(t: Transformation): Point {
    let v = new Vector(...this.coordinates.concat([1])).multiply(t);

    return new Point(...v.coordinates.slice(0, -1));
  }

  toString(): string {
    return `[${this.coordinates.join(', ')}]`;
  }
}

export class Vector implements Positionable, Transformable {
  readonly coordinates: number[];

  constructor (...coordinates: number[]) {
    this.coordinates = coordinates;
  }

  get length(): number {
    return this.coordinates.length;
  }

  // Returns [m] * [this]
  multiply(m: Matrix): Vector {
    if (m.width != this.length) {
      throw 'The width of the matrix must match the length of the vector';
    }

    return new Vector(...m.transpose().vectors.map((vector, index) =>
      vector.coordinates.reduce((prev, current, i) =>
        prev + current * this.coordinates[i], 0)
    ));
  }

  transform(t: Transformation): Vector {
    let v = new Vector(...this.coordinates.concat([1])).multiply(t);

    return new Vector(...v.coordinates.slice(0, -1));
  }

  opposite(): Vector {
    return new Vector(...this.coordinates.map(function (w: number) {
      return -w;
    }));
  }

  // Returns [value] * [this]
  scale(value: number): Vector {
    return new Vector(...this.coordinates.map(function (w: number) {
      return value * w;
    }));
  }

  sum(vector: Vector): Vector {
    if (this.length != vector.length) {
      throw 'The vectors must have the same length';
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

  // Returns [value] * [this]
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
      throw 'The width of [this] matrix must match the height of the matrix';
    }

    return new Matrix(...m.vectors.map((vector) => vector.multiply(this)));
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
      throw 'The width and the height of [this] matrix must match';
    }
  }

  scale(value: number): SquareMatrix {
    return new SquareMatrix(...super.scale(value).vectors);
  }

  transpose(): SquareMatrix {
    return new SquareMatrix(...super.transpose().vectors);
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

export class Transformation extends SquareMatrix implements Transformable {
  constructor (...vectors: Vector[]) {
    super(...vectors);

    var test = vectors
      .slice(-1)
      .every(function (vector) {
        let [lastCoordinate] = vector.coordinates.slice(-1);

        return lastCoordinate == 1;
      });
    if (!test) {
      throw 'The last coordinate of the last vector must be 1';
    }

    var test = vectors
      .slice(0, -1)
      .every(function (vector) {
        let [lastCoordinate] = vector.coordinates.slice(-1);

        return lastCoordinate == 0;
      });
    if (!test) {
      throw 'The last coordinate of the first vectors must be 0';
    }
  }

  transform(t: Transformation): Transformation {
    return new Transformation(...t.multiply(this).vectors);
  }
}
