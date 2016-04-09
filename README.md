# nativescript-socketio
# Usage
```
npm install nativescript-socketio
```
Set connection string and options then connect
```js
var SocketIO = require('nativescript-socketio');
var socketIO = new SocketIO.init(url,opts);
```

Send data to the server
```js
socketIO.emit(event,data)
```
Listen for data 
```js
socketIO.on(event,callback)
```
Set instance
```js
new SocketIO(null,null,oldInstance)
```