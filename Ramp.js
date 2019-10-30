import Color from './Color.js';
import vec2 from './vec2.js';
import Ball from './Ball.js';
import Utils from './Utils.js';

export default class Ramp {
  constructor() {
    this.points = [];
    this.game.addUpdateable(this);
    this.game.addRenderable(this);
    this.color = new Color(0,0,0);
    this.hoverColor = new Color(100, 100, 100);
    this.draggingPoint = null;

    this.addEventListeners();
  }

  static get POINT_SIZE() { return 10; }
  static get FRICTION() { return 0.95; }

  get game() { return window.game; }

  addEventListeners() {
    this.game.canvas.addEventListener("mousedown", (event) => {
      if (event.ctrlKey) {
        let hoveredPoint = this.getHoveredPoint();
        if (hoveredPoint) {
          if (event.shiftKey) {
            this.points = this.points.filter(point => point != hoveredPoint);
          } else {
            this.draggingPoint = hoveredPoint;
          }
        } else {
          this.points.push(this.game.mouse.pos.clone());
        }
      }
    });
    this.game.canvas.addEventListener("mouseup", (event) => {
      this.draggingPoint = null;
    });
  }

  getHoveredPoint() {
    for (let point of this.points) {
      if (point.distance(this.game.mouse.pos) < Ramp.POINT_SIZE) {
        return point;
      }
    }
    return null;
  }

  update() {
    this.checkCollisionOnBalls();
    this.dragPoint();
  }

  dragPoint() {
    if (this.draggingPoint && this.game.mouse.pos) {
      this.draggingPoint.x = this.game.mouse.pos.x;
      this.draggingPoint.y = this.game.mouse.pos.y;
    }
  }

  checkCollisionOnBalls() {
    this.game.balls.forEach(ball => {
      let lastPoint = null;
      this.points.forEach(point => {
        if (lastPoint) {
          let np = ball.pos.add(ball.vel);
          let closest = np.closestPointOnLine(lastPoint, point);
          if (closest.distance(np) < ball.size) {
            // mirror velocity to create a bounce
            let normal;
            if (closest === lastPoint) {
              normal = np.sub(lastPoint).normalize();
            } else if(closest === point) {
              normal = np.sub(point).normalize();
            } else {
              let line = point.sub(lastPoint).normalize();
              normal = new vec2(line.y, -line.x);
            }
            const force = Math.abs(ball.vel.dot(normal));
            ball.vel = ball.vel.sub(normal.scale(ball.vel.dot(normal) * 2)).scale(Ramp.FRICTION);
            // we hit here. play sound
            if (force > 0.5) {
              this.game.audio.play(Utils.rand(0.05, 3));
            }
          }
          closest = ball.pos.closestPointOnLine(lastPoint, point);
          if (closest.distance(ball.pos) < ball.size) {
            np = ball.pos.add(ball.vel);
            let pushOutDir = np.sub(closest).normalize();
            ball.pos = closest.add(pushOutDir.scale(ball.size));
          }
        }
        lastPoint = point;
      });
    });
  }

  render(ctx) {
    let hoveredPoint = this.getHoveredPoint();
    let lastPoint = null;
    this.points.forEach(point => {
      ctx.beginPath();
      ctx.fillStyle = (point === hoveredPoint ? this.hoverColor : this.color).toString();

      ctx.arc(point.x, point.y, Ramp.POINT_SIZE, 0, 2 * Math.PI);
      ctx.fill();

      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }

      lastPoint = point;
    });
  }

}
