import Utils from './Utils.js';
import Ball from './Ball.js';
import Color from './Color.js';
import Ramp from './Ramp.js';
import vec2 from './vec2.js';
import AudioSrc from './AudioSrc.js';

export default class BubbleGame {

	constructor(canvasId) {
		this.renderables = [];
		this.updateables = [];
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.mousePos = new vec2(-1, -1);
	}

	createRandomColor() {
		return new Color(
			Utils.rand(0, 50),
			Utils.rand(0, 50),
			Utils.rand(0, 50)
		);
	}

	init() {
		this.loadAudioFiles();
		this.addEventListeners();
		this.initRamp();
		this.spawnBalls();
	}

	loadAudioFiles() {
		this.audio = new AudioSrc('water.mp3');
	}

	addEventListeners() {
		this.mouse = {};
		this.canvas.addEventListener('mousemove', (event) => {
			this.mouse.pos = new vec2(event.x, event.y);
		});
		this.canvas.addEventListener('mousedown', (event) => {
			this.mouse.down = true;
		});
		this.canvas.addEventListener('mouseup', (event) => {
			this.mouse.down = false;
		});
		this.canvas.addEventListener('mouseout', (event) => {
			this.mouse.pos = new vec2(-1, -1);
		});
		window.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') {
				this.spawnBall();
			}
			else if (event.key === 'Escape') {
				this.clear();
			}
			else if (event.key === 'Backspace') {
				this.audio.play();
			}
		});
	}

	clear() {
		this.updateables = [];
		this.renderables = [];
		this.spawnBalls();
		this.initRamp();
	}

	spawnBalls() {
		this.balls = [];

		for (let i = 0; i < 1; i++) {
			this.spawnBall();
		}
	}

	spawnBall() {
		const size = Utils.rand(5, 30);
		this.balls.push(
			new Ball(
				Utils.rand(size, this.width - size),
				Utils.rand(size, this.height - size),
				size,
				this.createRandomColor(),
				this.balls
			)
		);
	}

	initRamp() {
		this.ramp = new Ramp();
	}

	startGame() {
		requestAnimationFrame(this.tick.bind(this));
	}

	tick() {
		this.update();
		this.render();
		requestAnimationFrame(this.tick.bind(this));
	}

	update() {
		this.updateables.forEach(updateable => {
			updateable.update();
		});
	}

	render() {
		this.ctx.clearRect(0, 0, this.width, this.height);

		this.renderables.forEach(renderable => {
		  renderable.render(this.ctx);
		});
	}

	addUpdateable(obj) {
		this.updateables.push(obj);
	}

	addRenderable(obj) {
		this.renderables.push(obj);
	}

	get width() { return this._width; }
	get height() { return this._height; }
	set width(width) { this._width = width; }
	set height(height) { this._height = height; }
};
