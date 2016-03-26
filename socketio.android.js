'use strict'
let SocketIO = require('./socketio.common');
let jsonHelper = require('./helpers/jsonHelper');
const Emitter = io.socket.emitter.Emitter;
const IO = io.socket.client.IO;
const Socket = io.socket.client.Socket;
const Ack = io.socket.client.Ack;
SocketIO.init = function (url, args) {
	let opts = new IO.Options();
	Object.assign(opts, args);
	this.socket = IO.socket(url, opts);
	this.socket.connect();
}

SocketIO.on = function (event, callback) {
	this.socket.on(event, new Emitter.Listener({
		call: function (args) {
			let payload = Array.prototype.slice.call(args);
			let ack = payload.pop();
			if (ack && !(ack.getClass().getName().indexOf('io.socket.client.Socket') === 0 && ack.call)) {
				payload.push(ack);
				ack = null;
			}

			payload = payload.map(jsonHelper.deserialize);
			if (ack) {
				let _ack = ack;
				ack = function () {
					var args = Array.prototype.slice.call(arguments).map(jsonHelper.serialize);
					_ack.call(args);
				};
				payload.push(ack);
			}
			callback.apply(null, payload);
			
		}
	}))
}
SocketIO.connect = function () {
	this.socket.connect();
}

SocketIO.emit = function (event) {
	let payload = Array.prototype.slice.call(arguments, 1);
	let ack = payload.pop();
	if (ack && typeof ack !== 'function') {
		payload.push(ack);
		ack = null;
	}
	payload = payload.map(jsonHelper.serialize);
	if (ack) {
		payload.push(new Ack({
			call: function (args) {
				args = Array.prototype.slice.call(args).map(jsonHelper.deserialize);
				ack.apply(null, args);
			},
		}));
	}
	this.socket.emit(event, payload);

}
SocketIO.disconnect = function () {
	this.socket.disconnect();
}
SocketIO.getInstance = function () {
	return this;
}


module.exports = SocketIO;

