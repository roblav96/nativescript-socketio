'use strict'
let SocketIO = require('./socketio.common');
const jsonHelper = require('./helpers/jsonHelper');
const Emitter = io.socket.emitter.Emitter;
const IO = io.socket.client.IO;
const Socket = io.socket.client.Socket;
const Ack = io.socket.client.Ack;

SocketIO.prototype.on = function(event, callback) {
    this.socket.on(event, new Emitter.Listener({
        call: function(args) {
            let payload = Array.prototype.slice.call(args);
            let ack = payload.pop();
            if (ack && !(ack.getClass().getName().indexOf('io.socket.client.Socket') === 0 && ack.call)) {
                payload.push(ack);
                ack = null;
            }

            payload = payload.map(jsonHelper.deserialize);
            if (ack) {
                let _ack = ack;
                ack = function() {
                    var args = Array.prototype.slice.call(arguments).map(jsonHelper.serialize);
                    _ack.call(args);
                };
                payload.push(ack);
            }
            console.log(payload)
            callback.apply(null, payload);

        }
    }))
}
SocketIO.prototype.connect = function() {
    this.socket.connect();
}

SocketIO.prototype.emit = function(event) {
    let payload = Array.prototype.slice.call(arguments, 1);
    let ack = payload.pop();
    if (ack && typeof ack !== 'function') {
        payload.push(ack);
        ack = null;
    }
    payload = payload.map(jsonHelper.serialize);
    if (ack) {
        payload.push(new Ack({
            call: function(args) {
                args = Array.prototype.slice.call(args).map(jsonHelper.deserialize);
                ack.apply(null, args);
            },
        }));
    }
    this.socket.emit(event, payload);

}
SocketIO.prototype.disconnect = function() {
    this.socket.disconnect();
}
SocketIO.prototype.getInstance = function() {
    return this.socket;
}

SocketIO.prototype.setInstance = function(instance) {
    this.socket = instance;
}

module.exports = SocketIO;

