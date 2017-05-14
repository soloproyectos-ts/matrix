export class Vector {
  // TODO: getValue(col: number): number
  // TODO: values property?
  // TODO: w is private?
  readonly w: Array<number>;

  constructor (...w: Array<number>) {
    this.w = w;
  }

  get length(): number {
    return this.w.length;
  }

  scale(value: number): Vector {
    return new Vector(...this.w.map(function (w: number) {
      return value * w;
    }));
  }

  get opposite(): Vector {
    return new Vector(...this.w.map(function (w: number) {
      return -w;
    }));
  }

  // Multiplies [m] by the vector.
  //
  // Returns [m] * [this]
  transform(m: Matrix): Vector {
    let w = [];

    if (m.width != this.length) {
      throw 'invalid matrix width';
    }

    for (let i = 0; i < m.width; i++) {
      let total = 0;

      for (let j = 0; j < m.vectors.length; j++) {
        total += m.vectors[j].w[i] * this.w[j];
      }

      w.push(total);
    }

    return new Vector(...w);
  }

  // Sums [v0] and [v1]
  //
  // Returns [v0] + [v1]
  static sum(v0: Vector, v1: Vector): Vector {
    if (v0.length != v1.length) {
      throw 'Vectors must have the same size';
    }

    return new Vector(...v0.w.map(function (w: number, index: number) {
      return w + v1.w[index];
    }));
  }

  // Subtracts [v1] from [v0];
  //
  // Returns [v0] - [v1]
  static sub(v0: Vector, v1: Vector): Vector {
    return Vector.sum(v0, v1.opposite);
  }

  toString(): string {
    return `[${this.w.join(', ')}]`;
  }
}

export class Matrix {
  readonly vectors: Array<Vector>;

  constructor (...vectors: Array<Vector>) {
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

  toString(): string {
    return this.vectors.map(function (vector: Vector) {
      return vector.toString();
    }).join('\n');
  }
}

export class SquareMatrix extends Matrix {
  constructor(...vectors: Vector[]) {
    super(...vectors);

    if (this.width != this.height) {
      throw 'Not a square matrix';
    }
  }

  transpose(): SquareMatrix {
    return new SquareMatrix(...this.vectors.map((vector, col) =>
      new Vector(...vector.w.map((number, row) => this.vectors[row].w[col]))
    ));
  }

  adjoint(): SquareMatrix {
    return new SquareMatrix(...this.vectors.map((vector, col) =>
      new Vector(...vector.w.map((value, row) => this._getCofactor(col, row)))
    ));
  }

  determinant(): number {
    let vector = this.width > 0? this.vectors[0]: new Vector();
    let initVal = this.width == 1? vector.w[0]: 0;

    return vector.w.reduce(
      (prev, current, index) => prev + current * this._getCofactor(0, index),
      initVal
    );
  }

  inverse(): SquareMatrix {
    return null;
  }

  private _getCofactor(col: number, row: number): number {
    let sign = (col + row) % 2 > 0? -1 : +1;
    let m = new SquareMatrix(...this.vectors.filter(function (vector, index) {
      return index != col;
    }).map(function (vector, index) {
      return new Vector(...vector.w.filter(function (value, index) {
        return index != row;
      }));
    }));

    return sign * m.determinant();
  }
}

/*
const _Point = Vector;
const _Vector = Vector;
const _Matrix = Matrix;
const _SquareMatrix = SquareMatrix;

export namespace dim2 {
  export class Point extends _Point {
    constructor (x: number, y: number) {
      super(x, y);
    }

    get x() {
      return this.w[0];
    }

    get y() {
      return this.w[1];
    }
  }

  export class Vector extends _Vector {
    constructor(x: number, y: number) {
      super(x, y);
    }

    get x() {
      return this.w[0];
    }

    get y() {
      return this.w[1];
    }

    get opposite(): Vector {
      return this.opposite;
    }
  }

  export class Matrix extends _Matrix<Vector> {
    constructor (...vectors: Array<Vector>) {
      super(...vectors);
    }
  }

  export class SquareMatrix extends _SquareMatrix<Vector> {

    constructor (v0: Vector, v1: Vector) {
      super(v0, v1);
    }

    get adjoint(): SquareMatrix {
      let [v0, v1] = this.vectors;

      return new SquareMatrix(new Vector(v1.y, -v0.y), new Vector(-v1.x, v0.x));
    }

    // Gets the matrix determinant.
    get determinant(): number {
      let [v0, v1] = this.vectors;

      return  v0.x * v1.y - v1.x * v0.y;
    }

    // Gets the inverse of the matrix.
    get inverse(): SquareMatrix {
      return this.adjoint.scale(1 / this.determinant) as SquareMatrix;
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

      return l1.point.sum(l1.vector.scale(w.y));
      return null;
    }
  }
}
*/
