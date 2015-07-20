/* Tests for F.style.js. */

F.test('Curves:', function () {
	F.test('Linear', function (t) {
		t.equals(0.0, F.curves.linear(0.0));
		t.equals(0.1, F.curves.linear(0.1));
		t.equals(0.2, F.curves.linear(0.2));
		t.equals(0.3, F.curves.linear(0.3));
		t.equals(0.4, F.curves.linear(0.4));
		t.equals(0.5, F.curves.linear(0.5));
		t.equals(0.6, F.curves.linear(0.6));
		t.equals(0.7, F.curves.linear(0.7));
		t.equals(0.8, F.curves.linear(0.8));
		t.equals(0.9, F.curves.linear(0.9));
		t.equals(1.0, F.curves.linear(1.0));
	});

	F.test('Sigmoid', function (t) {
		t.equals(0.000000000, F.curves.sigmoid(0.0));
		t.equals(0.008162571, F.curves.sigmoid(0.1));
		t.equals(0.026596994, F.curves.sigmoid(0.2));
		t.equals(0.083172696, F.curves.sigmoid(0.3));
		t.equals(0.231475217, F.curves.sigmoid(0.4));
		t.equals(0.500000000, F.curves.sigmoid(0.5));
		t.equals(0.768524783, F.curves.sigmoid(0.6));
		t.equals(0.916827304, F.curves.sigmoid(0.7));
		t.equals(0.973403006, F.curves.sigmoid(0.8));
		t.equals(0.991837429, F.curves.sigmoid(0.9));
		t.equals(1.000000000, F.curves.sigmoid(1.0));
	});

	F.test('Exp', function (t) {
		t.equals(0.00, F.curves.exp(0.0));
		t.equals(0.061207, F.curves.exp(0.1));
		t.equals(0.128851, F.curves.exp(0.2));
		t.equals(0.20361, F.curves.exp(0.3));
		t.equals(0.286231, F.curves.exp(0.4));
		t.equals(0.377541, F.curves.exp(0.5));
		t.equals(0.478454, F.curves.exp(0.6));
		t.equals(0.58998, F.curves.exp(0.7));
		t.equals(0.713236, F.curves.exp(0.8));
		t.equals(0.849455, F.curves.exp(0.9));
		t.equals(1.00, F.curves.exp(1.0));
	});

	F.test('Square', function (t) {
		t.equals(0.00, F.curves.square(0.0));
		t.equals(0.01, F.curves.square(0.1));
		t.equals(0.04, F.curves.square(0.2));
		t.equals(0.09, F.curves.square(0.3));
		t.equals(0.16, F.curves.square(0.4));
		t.equals(0.25, F.curves.square(0.5));
		t.equals(0.36, F.curves.square(0.6));
		t.equals(0.49, F.curves.square(0.7));
		t.equals(0.64, F.curves.square(0.8));
		t.equals(0.81, F.curves.square(0.9));
		t.equals(1.00, F.curves.square(1.0));
	});

	F.test('Cube', function (t) {
		t.equals(0.00, F.curves.cube(0.0));
		t.equals(0.001, F.curves.cube(0.1));
		t.equals(0.008, F.curves.cube(0.2));
		t.equals(0.027, F.curves.cube(0.3));
		t.equals(0.064, F.curves.cube(0.4));
		t.equals(0.125, F.curves.cube(0.5));
		t.equals(0.216, F.curves.cube(0.6));
		t.equals(0.343, F.curves.cube(0.7));
		t.equals(0.512, F.curves.cube(0.8));
		t.equals(0.729, F.curves.cube(0.9));
		t.equals(1.00, F.curves.cube(1.0));
	});

	F.test('Root2', function (t) {
		t.equals(0.00, F.curves.root2(0.0));
		t.equals(0.316228, F.curves.root2(0.1));
		t.equals(0.447214, F.curves.root2(0.2));
		t.equals(0.547723, F.curves.root2(0.3));
		t.equals(0.632456, F.curves.root2(0.4));
		t.equals(0.707107, F.curves.root2(0.5));
		t.equals(0.774597, F.curves.root2(0.6));
		t.equals(0.83666, F.curves.root2(0.7));
		t.equals(0.894427, F.curves.root2(0.8));
		t.equals(0.948683, F.curves.root2(0.9));
		t.equals(1.00, F.curves.root2(1.0));
	});

	F.test('Root3', function (t) {
		t.equals(0.00, F.curves.root3(0.0));
		t.equals(0.464159, F.curves.root3(0.1));
		t.equals(0.584804, F.curves.root3(0.2));
		t.equals(0.669433, F.curves.root3(0.3));
		t.equals(0.736806, F.curves.root3(0.4));
		t.equals(0.793701, F.curves.root3(0.5));
		t.equals(0.843433, F.curves.root3(0.6));
		t.equals(0.887904, F.curves.root3(0.7));
		t.equals(0.928318, F.curves.root3(0.8));
		t.equals(0.965489, F.curves.root3(0.9));
		t.equals(1.00, F.curves.root3(1.0));
	});

	F.test('Circle', function (t) {
		t.equals(0.00, F.curves.circle(0.0));
		t.equals(0.43589, F.curves.circle(0.1));
		t.equals(0.6, F.curves.circle(0.2));
		t.equals(0.714143, F.curves.circle(0.3));
		t.equals(0.8, F.curves.circle(0.4));
		t.equals(0.866025, F.curves.circle(0.5));
		t.equals(0.916515, F.curves.circle(0.6));
		t.equals(0.953939, F.curves.circle(0.7));
		t.equals(0.979796, F.curves.circle(0.8));
		t.equals(0.994987, F.curves.circle(0.9));
		t.equals(1.00, F.curves.circle(1.0));
	});

	F.test('CircleX', function (t) {
		t.equals(0.00, F.curves.circleX(0.0));
		t.equals(0.005013, F.curves.circleX(0.1));
		t.equals(0.020204, F.curves.circleX(0.2));
		t.equals(0.046061, F.curves.circleX(0.3));
		t.equals(0.083485, F.curves.circleX(0.4));
		t.equals(0.133975, F.curves.circleX(0.5));
		t.equals(0.2, F.curves.circleX(0.6));
		t.equals(0.285857, F.curves.circleX(0.7));
		t.equals(0.4, F.curves.circleX(0.8));
		t.equals(0.56411, F.curves.circleX(0.9));
		t.equals(1.00, F.curves.circleX(1.0));
	});
});

F.test('Interpolation', function (t) {
	t.equals('40px', F.interpolate(0.5, '20px', '60px'));
	t.equals('#abcdef', F.interpolate(0.5, '#87ddef', '#cfbdef'));
	t.equals('#8091a2', F.interpolate(0.5, '#567', '#abc'));
	t.equals('400', F.interpolate(0.4, '0', '1000'));

	t.equals('0', F.interpolate(0.0, '0', '1', F.curves.circleX));
	t.equals(0.083485, Number(F.interpolate(0.4, '0', '1', F.curves.circleX)));
	t.equals(0.133975, Number(F.interpolate(0.5, '0', '1', F.curves.circleX)));
	t.equals(0.2, Number(F.interpolate(0.6, '0', '1', F.curves.circleX)));
});
