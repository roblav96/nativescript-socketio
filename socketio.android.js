'use strict'
let Common = require('./socketio.common');
const Emitter = io.socket.emitter.Emitter;
const IO = io.socket.client.IO;
const Socket = io.socket.client.Socket;
const Ack = io.socket.client.Ack;
let SocketIO  = {};
SocketIO.socket = null;
SocketIO.init = function(url, args) {
			let opts = new IO.Options();
			Object.assign(opts, args);
			this.socket = IO.socket(url, opts);
			this.socket.connect();
};

SocketIO.on = function (event, callback) {

this.socket.on(event, new Emitter.Listener({
	 call: function (args) {
		
		 let payload = Array.prototype.slice.call(args);
		 let ack = payload.pop();

		 if (ack && !(ack.getClass().getName().indexOf('io.socket.client.Socket') === 0 && ack.call)) {
			 payload.push(ack);
			 ack = null;
		 }

	       	//payload = payload.map(JSON.parse); // :( 
		 //payload = payload.map(JSON.stringify); // :(
		 if (ack) {
			 var _ack = ack;
			 ack = function () {

				 var args = Array.prototype.slice.call(arguments).map(JSON.parse);
				 _ack.call(args);
			 };
			 payload.push(ack);
		 }
		 callback.apply(null, payload);
	 },
 }));

}
SocketIO.connect = function () {  //TODO

	this.socket.on('error', function (err) {
// erros.report(new erros.QueryError(err, 'SocketError'));
 });

 this.socket.on('connect_error', function (err) {
	 //erros.report(new erros.QueryError(err, 'SocketConnectError'));
 });

 this.socket.on('connect_timeout', function (err) {
	// erros.report(new erros.QueryError(err, 'SocketConnectTimeout'));
 });

 // this.on('reconnect_error', function (err) {
 //   erros.report(new erros.QueryError(err, 'SocketReconnectError'));
 // });

 this.socket.on('reconnect_failed', function (err) {
	// erros.report(new erros.QueryError(err, 'SocketReconnectFailed'));
 });

 this.socket.connect();
}
SocketIO.emit = function (event) {
   var payload = Array.prototype.slice.call(arguments, 1);
   var ack = payload.pop();
   if (ack && typeof ack !== 'function') {
     payload.push(ack);
     ack = null;
   }
   payload = payload.map(JSON.stringify);
   if (ack) {
     payload.push(new _Ack({
       call: function (args) {
         args = Array.prototype.slice.call(args).map(JSON.parse);
         ack.apply(null, args);
       },
     }));
   }
   this.socket.emit(event, payload);
}
SocketIO.disconnect = function () {
	this.socket.disconnect();
}

SocketIO.getInstance = function(){
	return this.socket;
}
module.exports =  SocketIO;
