/* F.style.js
 * Utilities for working with CSS, classes, and animations.
 */

if (typeof(F) === 'undefined') { F = {}; }

(function (f) {
	// Animates a set of CSS properties.
	// target: The DOM element (or ID) that the effect will be applied to.
	// start: Object containing the current/initial CSS properties.
	// end: Object containing the end/final CSS properties.
	// duration: (Optional) number of milliseconds that the animation will
	// span. Default: 1000 (1 second).
	// curve: (Optional) function that will be used to scale the transition.
	// See F.curves for some examples. Default: sigmoid.
	//
	// 'start' and 'end' MUST have the same properties.
	f.animate = function (target, start, end, duration, curve) {
		if (typeof(target) === 'string') {
			target = document.getElementById(target);
		}

		// Expect duration and/or curve.
		if (typeof(duration) == 'function') {
			curve = duration;
			duration = null;
		}

		// Default to 1 second.
		if (!duration) {
			duration = 1000;
		}

		curve = curve || f.curves.sigmoid;

		var attrs = [];
		for (var prop in start) {
			if (!end.hasOwnProperty(prop)) {
				throw 'Missing property ' + prop + ' in animation.';
			}

			var attr = {
				name: prop,
				start: start[prop],
				end: end[prop]
			};

			attrs.push(attr);
		}


		var started = null;

		// Apply the transitional attributes to the target.
		var applyFunc = function (ratio) {
			for (var i = 0; i < attrs.length; ++i) {
				var attr = attrs[i];
				target.style[attr.name] = f.interpolate(
						ratio, attr.start, attr.end, curve);
			}
		};

		// Repeat over the specified duration.
		var stepFunc = function () {
			if (started == null) { started = new Date(); }

			var ratio = (new Date() - started) / duration;
			ratio = Math.min(1.0, ratio);

			applyFunc(ratio);

			if (ratio < 1.0) {
				setTimeout(stepFunc, 25);
			}
		};

		// Start the animation.
		setTimeout(stepFunc, 0);
	};

	// Scale functions used for CSS animations.
	// Each scale function takes a value between 0 and 1 (inclusive) and
	// computes some multiplier. At 0, it MUST return 0; at 1 it MUST return 1.
	// In between, it can return anything between 0 and 1 (inclusive).
	//
	// Curves are described as 'concave' or 'convex' based on whether they
	// start out level and curve upwards, or start out steep and level out,
	// respectively.
	f.curves = {}

	// Simple idempotent scale function.
	f.curves.linear = function (val) {
		return val;
	};

	// An s-shaped curve, using the logistic function (1/(1 - EXP(-x))).
	f.curves.sigmoid = function (val) {
		// The logistic function is asymptotic, so special cases
		// for the start/end of the curve are needed.
		if (val == 0) { return 0; }
		if (val == 1) { return 1; }
		return 1 / (1 + Math.exp(-(val*12 - 6)));
	};

	// A dramatic, exponential (concave) curve.
	f.curves.exp = function (val) {
		return (Math.exp(val) - 1) / (Math.exp(1) - 1);
	};

	// A slight concave curve, based on the square of the input.
	f.curves.square = function (val) {
		return val * val;
	};

	// A more extreme concave curve, based on the cube of the input.
	f.curves.cube = function (val) {
		return Math.pow(val, 3);
	};

	// A slight convex curve, based on the square root of the input.
	f.curves.root2 = function (val) {
		return Math.pow(val, 1/2);
	};

	// A more extreme convex curve, based on the cube root of the input.
	f.curves.root3 = function (val) {
		return Math.pow(val, 1/3);
	};

	// An even, convex curve using the top-left quadrant of a unit circle.
	f.curves.circle = function (val) {
		return Math.pow(1 - Math.pow(val - 1, 2), 1/2);
	};

	// An even, concave curve using the bottom-right quadrant of a unit circle.
	f.curves.circleX = function (val) {
		return 1 - Math.pow(1 - Math.pow(val, 2), 1/2);
	};

	// Interpolates between two values.
	// ratio: A number from 0 to 1 indicating how far along the curve the
	// current value is.
	// start: The start value (at 0).
	// end: The end value (at 0).
	// curve: Transformation that will be applied to the ratio.
	// Default: linear.
	f.interpolate = function (ratio, start, end, curve) {
		curve = curve || f.curves.linear;
		var ratio = curve(ratio);

		var val1 = f.parseValue(start);
		var val2 = f.parseValue(end);

		if (val1 && val2 && val1.units == val2.units) {
			if (val1.units == 'color') {
				var r1 = parseInt(val1.val.r, 16);
				var g1 = parseInt(val1.val.g, 16);
				var b1 = parseInt(val1.val.b, 16);

				var r2 = parseInt(val2.val.r, 16);
				var g2 = parseInt(val2.val.g, 16);
				var b2 = parseInt(val2.val.b, 16);

				var r = (ratio * r2) + ((1 - ratio) * r1);
				var g = (ratio * g2) + ((1 - ratio) * g1);
				var b = (ratio * b2) + ((1 - ratio) * b1);

				r = Math.round(r).toString(16);
				g = Math.round(g).toString(16);
				b = Math.round(b).toString(16);

				if (r.length == 1) { r = '0' + r; }
				if (g.length == 1) { g = '0' + g; }
				if (b.length == 1) { b = '0' + b; }

				return '#' + r + g + b;
			}
			else {
				var val = (ratio * val2.val) + ((1- ratio) * val1.val);
				return val + val1.units;
			}
		}
		else {
			throw 'Could not interpolate between ' + start + ' and ' + end;
		}
	};

	// Parses a string as a CSS color value.
	f.parseColor = (function () {
		var colorPattern = /^\s*#(?:([0-9a-f]{3})|([0-9a-f]{6}))\s*$/i;

		return function (val) {
			var match = val.match(colorPattern);
			if (match) {
				if (match[1]) {
					// #rgb format
					return {
						r: match[1][0] + match[1][0],
						g: match[1][1] + match[1][1],
						b: match[1][2] + match[1][2]
					};
				}
				else {
					// #rrggbb format
					return {
						r: match[2].substr(0, 2),
						g: match[2].substr(2, 2),
						b: match[2].substr(4, 2)
					};
				}
			}
			else {
				return null;
			}
		};
	})();

	// Parses a CSS value into a val/units object.
	f.parseValue = (function () {
		// Matches values consisting of a number followed by units
		// (e.g. "42px").
		var suffixPattern = /^\s*(-?\d+(?:\.\d+)?)(\S*)\s*$/;

		return function (val) {
			var match = val.match(suffixPattern);
			if (match) {
				return {
					val: Number(match[1]),
					units: match[2] == '' ? null : match[2]
				};
			}
			else {
				// Try to parse as a color value.
				var color = f.parseColor(val);
				if (color) {
					return {
						val: color,
						units: 'color'
					};
				}
			}

			return null;
		};
	})();
})(F);
