"use strict";
var observable_1 = require('data/observable');
var SocketIO = require('nativescript-socketio');
var frameModule = require('ui/frame');
var socketIO;
var pageData = new observable_1.Observable({
    item: '',
    username: 'Osei'
});
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = pageData;
}
exports.pageLoaded = pageLoaded;
function join(args) {
    socketIO = new SocketIO('http://192.168.56.1:3000', {});
    socketIO.emit('add user', { username: pageData.get("username") });
    socketIO.on('login', function (data) {
        frameModule.topmost().navigate({ moduleName: 'main-page', context: { username: pageData.get("username"), socket: socketIO.getInstance() } });
    });
}
exports.join = join;
