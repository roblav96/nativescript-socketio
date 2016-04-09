"use strict";
var observable_1 = require('data/observable');
var observable_array_1 = require('data/observable-array');
var frameModule = require('ui/frame');
var socketIO = require('nativescript-socketio');
var SocketIO;
var pageData = new observable_1.Observable({
    list: new observable_array_1.ObservableArray(),
    textMessage: '',
    currentUser: ''
});
var page;
var context;
function navigatingTo(args) {
    page = args.object;
    context = page.navigationContext;
    pageData.set("currentUser", context.username);
    SocketIO = new socketIO(null, null, context.socket);
    SocketIO.on('new message', function (data) {
        pageData.list.push(data);
    });
    SocketIO.on('disconnect', function () {
        // pageData.list.push.length = 0;
        frameModule.topmost().navigate('login');
    });
    SocketIO.on('getMessages', function (data) {
        if (data.length > 0) {
            if (pageData.list.length !== data.length) {
                var messages = data;
                for (var i = 0; i < messages.length; i++) {
                    pageData.list.push(messages[i]);
                }
            }
        }
    });
}
exports.navigatingTo = navigatingTo;
function pageLoaded(args) {
    page.bindingContext = pageData;
    SocketIO.emit('getMessages');
}
exports.pageLoaded = pageLoaded;
function sendText() {
    var data = {
        username: context.username,
        message: pageData.get("textMessage"),
        timeStamp: +new Date()
    };
    SocketIO.emit('new message', data);
    pageData.list.push(data);
    pageData.set("textMessage", "");
}
exports.sendText = sendText;
function logout() {
    SocketIO.disconnect();
}
exports.logout = logout;
