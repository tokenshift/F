# F.channels

_Asynchronous programming without callback hell._

	;(function () {

## Basics

A channel is an object that routes messages from senders to receivers. Channels
are both non-blocking and unbuffered, which means that messages sent when there
are no listeners are discarded. If you need to ensure receipt of a particular
message, make sure the listener is ready to receive before message sending
begins.

		function Channel() {
			this._message = null;
			this._open = true;
			this._waitingHead = null;
			this._waitingTail = null;
		}

Messages are routed through channels using the `send` and `recv` methods on
the channel. The `send` method takes a message and either passes it to a
waiting receiver, or holds on to it for the next `recv` call (if no listener is
already waiting for a message).

Only the most recent message is kept if no consumer was ready to receive it.
This is helpful when processing events like mouse movement that may occur
faster than the receiver's ability to process them.

		Channel.prototype.send = function (msg) {
			if (!this._open) { return; }

			var waiting = dequeue(this);
			if (waiting == null) {
				this._message = msg;
			}
			else {
				setTimeout(function () {
					waiting(msg)
				}, 0);
			}
		};

The `recv` method takes a function that will be called with the next (or
current, see above) message. Even if there is a message immediately available,
the receiver will be invoked asynchronously, to ensure similar behavior
regardless of whether the message was sent before or after `recv` was called.

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

Once a channel is closed, it will cease routing any subsequent messages.
Sending to a closed channel does not cause any errors, but the sent messages
will be silently ignored and discarded.

		Channel.prototype.close = function () {
			this._open = false;
			this._message = null;
			this._waitingHead = null;
			this._waitingTail = null;
		};

## Utilities

Rather than receiving a single message, the `subscribe` method receives
messages from the channel until it is closed.

		Channel.prototype.subscribe = function (fun) {
			var channel = this;
			var recur = function (msg) {
				fun(msg);
				channel.recv(recur);
			};
			this.recv(recur);
		};

Calling `map` on a channel returns a new channel that will apply the provided
mapping to each message that it receives, similar to mapping over a list.

		Channel.prototype.map = function (fun) {
			var mapped = new Channel();

			this.subscribe(function (msg) {
				mapped.send(fun(msg));
			});

			return mapped;
		};

A throttled channel will only pass a message through once in a given interval
(specified in milliseconds). Additional messages are silently discarded.

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

Provide a predicate function to the `where` method to create a channel that
only passes through messages matching the predicate.

		Channel.prototype.where = function (pred) {
			var filtered = new Channel();

			this.subscribe(function (msg) {
				if (pred(msg)) {
					filtered.send(msg);
				}
			});

			return filtered;
		};

## Channel Internals

Waiting receivers are kept on a FIFO queue, implemented as a linked list. The
channel itself tracks the head and tail of the list, so that enqueues and
dequeues are both constant time, while each of the queued receivers tracks the
subsequent receiver.

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

## Exports

Only channel construction is exported.

		this.channel = function () {
			return new Channel();
		};
	
**F.channels** is attached to the global F object.

	}.call(window.F = window.F || {}))
