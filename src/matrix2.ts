export class Point {
  readonly z: Array<number>;

  constructor (...z: Array<number>) {
    this.z = z;
  }

  move(vector: Vector): Point {
    return new Point(...this.z.map(function (z: number, index: number) {
      if (vector.z[index] === undefined) {
        throw 'Argument error: invalid vector size';
      }

      return z + vector.z[index];
    }));
  }

  toString(): string {
    return `[${this.z.join(', ')}]`;
  }
}

export class Vector {
  readonly z: Array<number>;

  constructor (...z: Array<number>) {
    this.z = z;
  }

  scale(value: number): Vector {
    return new Vector(...this.z.map(function (z: number) {
      return value * z;
    }));
  }

  get length(): number {
    return this.z.length;
  }

  get opposite(): Vector {
    return new Vector(...this.z.map(function (z: number) {
      return -z;
    }));
  }

  // Sums [v0] and [v1]
  //
  // Returns [v0] + [v1]
  static sum(v0: Vector, v1: Vector): Vector {
    if (v0.length != v1.length) {
      throw 'Argument error: vectors must have the same size';
    }

    return new Vector(...v0.z.map(function (z: number, index: number) {
      return z + v1.z[index];
    }));
  }

  // Subtracts [v1] from [v0];
  //
  // Returns [v0] - [v1]
  static sub(v0: Vector, v1: Vector): Vector {
    return Vector.sum(v0, v1.opposite);
  }

  toString(): string {
    return `[${this.z.join(', ')}]`;
  }
}

export class Matrix {
  readonly vectors: Array<Vector>;
  readonly width: number;

  constructor (...vectors: Array<Vector>) {
    let width = vectors.length > 0? vectors[0].length : 0;
    if (!vectors.every(function (vector: Vector) {
      return vector.length == width;
    })) {
      throw 'Argument error: all vector must have the same length';
    };

    this.vectors = vectors;
    this.width = width;
  }

  get height(): number {
    return this.vectors.length;
  }

  scale(value: number) {
    return new Matrix(...this.vectors.map(function (vector: Vector) {
      return vector.scale(value);
    }));
  }

  toString(): string {
    return this.vectors.map(function (vector: Vector) {
      return vector.toString();
    }).join('\n');
  }
}

export abstract class SquareMatrix extends Matrix {
  constructor(...v: Array<Vector>) {
    super(...v);

    if (this.width != this.height) {
      throw 'Argument error: not a square matrix';
    }
  }

  abstract get adjoint(): SquareMatrix;
  abstract get determinant(): number;
  abstract get inverse(): SquareMatrix;
}

export namespace dim2 {
  export class Point {
    readonly x: number;
    readonly y: number;

    constructor (x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    move(vector: Vector): Point {
      return new Point(this.x + vector.x, this.y + vector.y);
    }
  }

  export class Vector {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
      [this.x, this.y] = [x, y];
    }

    static createFromPoints(p0: Point, p1: Point): Vector {
      let v0 = new Vector(p0.x, p0.y);
      let v1 = new Vector(p1.x, p1.y);

      return Vector.sub(v0, v1);
    }

    get opposite(): Vector {
      return new Vector(-this.x, -this.y);
    }

    get length(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Multiplies the vector by a [value].
    //
    // Returns [this] * [value]
    scale(value: number): Vector {
      return new Vector(value * this.x, value * this.y);
    }

    // Multiplies [m] by the vector.
    //
    // Returns [m] * [this]
    transform(m: SquareMatrix): Vector {
      let [v0, v1] = m.vectors;

      return new Vector(
        v0.x * this.x + v1.x * this.y,
        v0.y * this.x + v1.y * this.y
      );
    }

    // Sum [v0] and [v1]
    //
    // Returns [v0] + [v1]
    static sum(v0: Vector, v1: Vector): Vector {
      return new Vector(v0.x + v1.x, v0.y + v1.y);
    }

    // Subtract [v1] from [v0];
    //
    // Returns [v0] - [v1]
    static sub(v0: Vector, v1: Vector): Vector {
      return Vector.sum(v1, v0.opposite);
    }
  }

  export class Matrix {
    readonly vectors: Array<Vector>;

    constructor (...vectors: Array<Vector>) {
      this.vectors = vectors;
    }

    // Scales a matrix
    //
    // Returns [this] * [value]
    scale(value: number): Matrix {
      let vectors = [];

      for (let vector of this.vectors) {
        vectors.push(vector.scale(value));
      }

      return new Matrix(...vectors);
    }
  }

  export class SquareMatrix extends Matrix {

    constructor (v0: Vector, v1: Vector) {
      super(v0, v1);
    }

    // Gets the matrix adjoint.
    get adj(): SquareMatrix {
      let [v0, v1] = this.vectors;

      return new SquareMatrix(new Vector(v1.y, -v0.y), new Vector(-v1.x, v0.x));
    }

    // Gets the matrix determinant.
    get det(): number {
      let [v0, v1] = this.vectors;

      return  v0.x * v1.y - v1.x * v0.y;
    }

    // Gets the inverse of the matrix.
    get inverse(): SquareMatrix {
      return this.adj.scale(1 / this.det) as SquareMatrix;
    }
  }

  export class Line {
    readonly point: Point;
    readonly vector: Vector;

    constructor(point: Point, vector: Vector) {
      this.point = point;
      this.vector = vector;
    }

    // Gets the parallel line that contains the point [p].
    getParallel(p: Point): Line {
      return new Line(p, this.vector);
    }

    // Gets the perpendicular line that contains the point [p].
    getPerpendicular(p: Point): Line {
      return new Line(p, new Vector(-this.vector.y, this.vector.x));
    }

    static isParallel(l0: Line, l1: Line): boolean {
      let v0 = l0.vector;
      let v1 = l1.vector;

      return v0.x * v1.y == v1.x * v0.y;
    }

    static getIntersection(l0: Line, l1: Line): Point {
      let m = new SquareMatrix(l0.vector, l1.vector.opposite);
      let v = Vector.createFromPoints(l0.point, l1.point);
      let w = v.transform(m.inverse);

      return l1.point.move(l1.vector.scale(w.y));
    }
  }
}
