export default class Color {
  constructor(r,g,b,a) {
    if (r instanceof Color) {
      this.r = r.r;
      this.g = r.g;
      this.b = r.b;
      this.a = r.a;
    } else {
      this.r = r || 0;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a || 1;
    }
  }

  maximizeBrightness() {
    const len = Math.sqrt(this.r**2 + this.g**2 + this.b**2);
    const fac = 255 / len;
    return new Color(this.r * fac, this.g * fac, this.b * fac, this.a);
  }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
