/* Simple JavaScript unit testing micro-library. */

if (typeof(F) === 'undefined') { F = {}; }

(function (f) {
	var ctx = null;
	var tests = [];

	// Runs all tests currently defined.
	// Also clears the list of defined test, so that any additional tests are
	// created in a new context.
	// target: A DOM element (or ID) where the test results will be placed.
	F.runTests = function (target) {
		ctx = new TestContext(target);
		for (var i = 0; i < tests.length; ++i) {
			ctx._runTest(tests[i]);
		};

		tests = [];
		ctx = null;
	};

	// Defines a new test or test context.
	// name: The (string, optional) name of the test.
	// func: The test (or test context) itself.
	F.test = function (name, func) {
		// Expect just a function, or a name and a function.
		if (typeof (name) === 'function') {
			func = name;
			name = null;
		}

		if (ctx == null) {
			// If in the root context, define a test for future execution.
			tests.push({
				name: name,
				func: func
			});
		}
		else {
			// Otherwise, execute the test in the current context.
			ctx._runTest({name: name, func: func});
		}
	};

	// The test context object that is passed
	// to each test.
	function TestContext(target) {
		if (typeof(target) === 'string') {
			this.target = document.getElementById(target);
		}
		else {
			this.target = target;
		}

		// Stack of test names.
		this.stack = [];

		// The div that assertion results will be added to.
		this.block = null;
	};

	// Assert equality.
	TestContext.prototype.equals = function (expected, actual, message) {
		var result = 'Expected ' + expected + ', got ' + actual + ' . ';

		if (typeof(expected) === 'number' && typeof(actual) === 'number') {
			// Use 'very close' rather than equality for floats.
			var delta = 0.000001;
			if (expected + delta >= actual && expected - delta <= actual) {
				// Pass
				this._write(message, result, 'equals pass');
				return;
			}
			else {
				// Fail
				this._write(message, result, 'equals fail');
			}
		}
		else if (expected == actual) {
			// Pass
			this._write(message, result, 'equals pass');
			return;
		}
		else {
			// Fail
			this._write(message, result, 'equals fail');
		}
	};

	// Concatenates the test context stack into a single test name.
	TestContext.prototype._getTestName = function () {
		var name = '';
		for (var i = 0; i < this.stack.length; ++i) {
			if (this.stack[i] != null && this.stack[i] != '') {
				if (i > 0) {
					name += ' ';
				}

				name += this.stack[i];
			}
		}

		return name == '' ? null : name;
	};

	// Pops a name from the test context stack.
	TestContext.prototype._pop = function () {
		if (this.stack.length > 1) {
			this.block = this.block.parentElement;
		}
		else {
			this.block = null;
		}

		return this.stack.pop();
	};
	
	// Pushes a name onto the test context stack.
	TestContext.prototype._push = function (name) {
		this.stack.push(name);

		var block = document.createElement('DIV');
		block.className = 'test';
		if (this.block) {
			this.block.appendChild(block);
		}
		else {
			this.target.appendChild(block);
		}
		this.block = block;

		var name = this._getTestName();
		if (name) {
			var testName = document.createElement('SPAN');
			testName.className = 'test-name';
			testName.appendChild(document.createTextNode(name));
			block.appendChild(testName);
		};
	};

	// Runs the specified test in the current context.
	TestContext.prototype._runTest = function (test) {
		this._push(test.name);

		try {
			// Execute the test against this context.
			test.func(this);
		} catch (e) {
			this._writeException(e);
		}

		this._pop();
	};

	// Outputs a test result message.
	TestContext.prototype._write = function (message, result, classes) {
		var div = document.createElement('DIV');
		div.className = classes ? 'test-result ' + classes : 'test-result';

		if (message) {
			div.appendChild(document.createTextNode(message));
			if (result) {
				div.appendChild(document.createElement('BR'));
			}
		}

		if (result) {
			div.appendChild(document.createTextNode(result));
		}

		this.block.appendChild(div);
	};

	// Outputs the details of an exception.
	TestContext.prototype._writeException = function (e) {
		this._write(null, e, "fail exception");
	};
})(F);
