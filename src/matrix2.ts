export class Point {
  readonly x: number;
  readonly y: number;

  constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  translate(vector: Vector): Point {
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

export class SquareMatrix {
  readonly vectors: [Vector, Vector];

  constructor (v0: Vector, v1: Vector) {
    this.vectors = [v0, v1];
  }

  // Scales a matrix
  //
  // Returns [this] * [value]
  scale(value: number): SquareMatrix {
    return new SquareMatrix(
      this.vectors[0].scale(value), this.vectors[1].scale(value)
    );
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
    return this.adj.scale(1 / this.det);
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

    return l1.point.translate(l1.vector.scale(w.y));
  }
}
