export class Point {
  readonly x: number;
  readonly y: number;

  constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  translate(v: Vector): Point {
    return new Point(this.x + v.x, this.y + v.y);
  }
}

export class Vector {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    [this.x, this.y] = [x, y];
  }

  get opposite(): Vector {
    return new Vector(-this.x, -this.y);
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Multiplies the vector by a [value].
  //
  // Returns [this] * [value].
  scale(value: number): Vector {
    return new Vector(value * this.x, value * this.y);
  }

  // Multiplies [m] by the vector.
  //
  // Returns [m] * [this].
  transform(m: Matrix): Vector {
    let [v0, v1] = m.vectors;

    return new Vector(
      v0.x * this.x + v1.x * this.y,
      v0.y * this.x + v1.y * this.y
    );
  }

  static sum(v0: Vector, v1: Vector): Vector {
    return new Vector(v0.x + v1.x, v0.y + v1.y);
  }
}

export class Matrix {
  readonly vectors: [Vector, Vector];

  constructor (v0: Vector, v1: Vector) {
    this.vectors = [v0, v1];
  }

  // Scales a matrix
  //
  // Returns [this] * [value].
  scale(value: number): Matrix {
    return new Matrix(
      this.vectors[0].scale(value), this.vectors[1].scale(value)
    );
  }

  // Gets the matrix adjoint.
  get adj(): Matrix {
    let [v0, v1] = this.vectors;

    return new Matrix(new Vector(v1.y, -v0.y), new Vector(-v1.x, v0.x));
  }

  // Gets the matrix determinant.
  get det(): number {
    let [v0, v1] = this.vectors;

    return  v0.x * v1.y - v1.x * v0.y;
  }

  // Gets the inverse of the matrix.
  get inverse(): Matrix {
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
    let m = new Matrix(l0.vector, l1.vector.opposite);
    let v = vector(l0.point, l1.point);
    let w = v.transform(m.inverse);

    return l1.point.translate(l1.vector.scale(w.y));
    //return Vector.sum(l1.point, l1.vector.scale(w.y));
  }
}

// TODO: remove this function
export function vector(p0: Point, p1: Point): Vector {
  let v0 = new Vector(p0.x, p0.y);
  let v1 = new Vector(p1.x, p1.y);

  return Vector.sum(v1, v0.opposite);
}
