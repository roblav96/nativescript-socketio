import common = require('./socketio.common');

declare var SocketIOClient;
declare var SocketAckEmitter;

declare var NSURL;
declare var NSDictionary;
declare var NSArray;
declare var NSObject;

export class SocketIO extends common.SocketIO {
    
    socket: any;
    
    /**
     * Class Constructor
     * args[0]: Connection URL as String
     * args[1]: Connection Options
     */
    constructor(...args: any[]) {
        super();
        
        switch (args.length) {
            case 2:
                const opts = new NSDictionary(["nsp"],["/staff"]);
                this.socket = SocketIOClient.alloc().initWithSocketURLOptions(
                    NSURL.URLWithString(args[0]),
                    opts
                );
                break;
            
            case 3:
                this.instance = args.pop();
                break;
        }
    }

    on(event: String, callback: Function) : void {

        this.socket.onCallback(event, (data, ack)=>{
            console.log('Event: ', event);
            callback(data);
        });
    };

    connect() : void {
        this.socket.connect();
    }

    emit(...args: any[]) : void {
        if (!args) {
            return console.error('Emit Failed: No arguments');
        }
        
        // Slice parameters into Event and Message/Ack Callback
        const event = args[0];
        const payload = Array.prototype.slice.call(args, 1);

        // Send message (and optionally ack callback)
        this.socket.emitWithItems(event, payload);
    }

    disconnect() : void {
        this.socket.disconect();
    }

    public get instance() {
        return this.socket;
    }

    public set instance(instance) {
        this.socket = instance;
    }

    joinNamespace(nsp: String): void{
        this.socket.joinNamespace(nsp);
    }

    leaveNamespace(): void{
        this.socket.leaveNamespace();
    }
}