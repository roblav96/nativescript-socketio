"use strict";
var observable_1 = require('data/observable');
var socketIO = require('nativescript-socketio');
var frameModule = require('ui/frame');
socketIO.init('http://192.168.56.1:3000', {});
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
    socketIO.emit('add user', { username: pageData.get("username") });
}
exports.join = join;
socketIO.on('login', function (data) {
    frameModule.topmost().navigate({ moduleName: 'main-page', context: { username: pageData.get("username") } });
});
