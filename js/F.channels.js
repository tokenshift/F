/** F.channels
 * Asynchronous programming without callback hell.
 */

window.F = window.F || {};

(function () {
	function Channel() {
		this._message = null;
		this._open = true;
		this._waiting = null;
	}

	// Closes the channel.
	Channel.prototype.close = function () {
		this._open = false;
		this._message = null;
		this._waiting = null;
	};

	// Sends a message to a channel.
	Channel.prototype.send = function (msg) {
		if (!this._open) { return; }

		if (this._waiting == null) {
			// Only the most recent message is kept if no consumer was ready to
			// receive it.
			this._message = msg;
		}
		else {
			var waiting = this._waiting;
			this._waiting = null;
			setTimeout(function () {
				waiting(msg)
			}, 0);
		}
	};

	// Receives a message from a channel.
	Channel.prototype.recv = function (fun) {
		if (!this._open) { return; }

		if (this._message != null) {
			var msg = this._message;
			this._message == null;
			setTimeout(function () {
				fun(msg);
			}, 0);
		}
		else if (this._waiting == null) {
			this._waiting = fun;
		}
		else {
			var waiting = this._waiting;
			var ch = this;
			this._waiting = function (msg) {
				// Let the already registered consumer get the next message,
				// but register this consumer for the one after.
				ch.recv(fun);
				waiting(msg);
			};
		}
	};

	// Receives messages from the channel until it is closed.
	Channel.prototype.subscribe = function (fun) {
		if (!this._open) { return; }

		var ch = this;
		var recur = function (msg) {
			fun(msg);
			ch.recv(recur);
		};

		this.recv(recur);
	};

	// Creates a new channel.
	F.channel = function () {
		return new Channel();
	};
})();
