/** F.channels
 * Asynchronous programming without callback hell.
 */

window.F = window.F || {};

(function () {
	function Channel() {
		this._message = null;
		this._open = true;
		this._waitingHead = null;
		this._waitingTail = null;
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

		var waiting = dequeue(this);
		if (waiting == null) {
			// Only the most recent message is kept if no consumer was ready to
			// receive it.
			this._message = msg;
		}
		else {
			setTimeout(function () {
				waiting(msg)
			}, 0);
		}
	};

	// Receives a message from the channel.
	Channel.prototype.recv = function (fun) {
		if (!this._open) { return; }

		if (this._message != null) {
			var msg = this._message;
			this._message == null;
			setTimeout(function () {
				fun(msg);
			}, 0);
		}
		else {
			enqueue(this, fun);
		}
	};

	// Receives messages from the channel until it is closed.
	Channel.prototype.subscribe = function (fun) {
		var channel = this;
		var recur = function (msg) {
			fun(msg);
			channel.recv(recur);
		};
		this.recv(recur);
	};

	// Returns a channel that will pass through all messages matching the
	// specified predicate.
	Channel.prototype.where = function (pred) {
	};

	// Returns a throttled channel that will pass through a message at most
	// once every X milliseconds.
	Channel.prototype.throttle = function (interval) {
		var throttled = new Channel();
		var lastTick = null;

		this.subscribe(function (msg) {
			if (lastTick == null || lastTick + interval < Date.now()) {
				lastTick = Date.now();
				throttled.send(msg);
			}
		});

		return throttled;
	};

	// Enqueues a waiting consumer.
	var enqueue = function (channel, waiting) {
		if (channel._waitingTail == null) {
			channel._waitingHead = waiting;
			channel._waitingTail = waiting;
		}
		else {
			channel._waitingTail._waitingNext = waiting;
			channel._waitingTail = waiting;
		}
		waiting._waitingNext = null;
	}

	// Dequeues the first waiting consumer.
	var dequeue = function (channel) {
		if (channel._waitingHead != null) {
			var head = channel._waitingHead;
			
			channel._waitingHead = head._waitingNext;
			if (channel._waitingHead == null) {
				channel._waitingTail = null;
			}

			return head;
		}
		else {
			return null;
		}
	};

	// Creates a new channel.
	F.channel = function () {
		return new Channel();
	};
})();
