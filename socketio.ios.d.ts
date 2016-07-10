import common = require('./socketio.common');
export declare class SocketIO extends common.SocketIO {
    socket: any;
    constructor(...args: any[]);
    on(event: String, callback: Function): void;
    connect(): void;
    emit(...args: any[]): void;
    disconnect(): void;
    instance: any;
    joinNamespace(nsp: String): void;
    leaveNamespace(): void;
}
