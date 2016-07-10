declare var io:any;
import common = require('./socketio.common');
const jsonHelper = require('./helpers/jsonHelper');
const app = require("application");
const Emitter = io.socket.emitter.Emitter;
const IO = io.socket.client.IO;
const Socket = io.socket.client.Socket;
const Ack = io.socket.client.Ack;
export class SocketIO extends common.SocketIO {
    
    socket;
    
    constructor(...args: any[]) {
        super();
        switch (args.length) {
            case 2:
                let opts = new IO.Options();
                (<any>Object).assign(opts, args[1]);
                this.socket = IO.socket(args[0], opts);
                break;
            case 3:
                this.instance = args.pop();
                break;
        }

    }

    on(event, callback) {
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

    connect() {
        this.socket.connect();
    }

    emit(...args: any[]) {
        let event = args[0];
        let payload = Array.prototype.slice.call(args, 1);
        let ack = payload.pop();
        if (ack && typeof ack !== 'function') {
            payload.push(ack);
            ack = null;
        }
        payload = payload.map(jsonHelper.serialize);
        if (ack) {
            payload.push(new Ack({
                call: (args) => {
                    args = Array.prototype.slice.call(args).map(jsonHelper.deserialize);
                    ack.apply(null, args);
                },
            }));
        }
        this.socket.emit(event, payload);
    }

    disconnect() {
        this.socket.disconnect();
    }

    public get instance() {
        return this.socket;
    }

    public set instance(instance) {
        this.socket = instance;
    }

    joinNamespace(nsp: String): void{
        const manager = this.socket.io();
        this.socket = manager.socket(nsp);
        this.socket.connect();
    }

    leaveNamespace(): void{

    }

}