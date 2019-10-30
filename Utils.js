export default {
	rand: (from, to) => {
		return Math.random() * (to - from) + from;
	},
	clamp: (value, min, max) => {
		return Math.min(Math.max(value, min), max);
	},
};
