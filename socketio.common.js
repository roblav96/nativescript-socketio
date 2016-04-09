'use strict'
const app = require("application");
const IO = io.socket.client.IO;
const Socket = io.socket.client.Socket;
function SocketIO(url, args, instance) {
    if (app.android) {
        if (instance) {
            this.socket = instance;
            return;
        }
        let opts = new IO.Options();
        Object.assign(opts, args);
        this.socket = IO.socket(url, opts);
        this.socket.connect();

    }
};
module.exports = SocketIO;