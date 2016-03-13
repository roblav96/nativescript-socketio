'use strict'
let Observable = require('data/observable').Observable;
let ObservableArray = require('data/observable-array').ObservableArray;
let common = require('./shared/nativescript-socketio/socketio.common');
let SocketIO = require('./shared/nativescript-socketio/socketio');
let frameModule = require('ui/frame');
SocketIO.init('http://192.168.56.1:3000', {});
let pages = require('ui/page');
let pageData = new Observable({
  list: new ObservableArray(),
  item:''
})
// Event handler for Page "loaded" event attached in main-page.xml
exports.pageLoaded = function(args) {
    // Get the event sender
    var page = args.object;
    page.bindingContext = pageData;
}
exports.join = function(args){
  SocketIO.emit('add user',{username:pageData.get("username")})
}

SocketIO.on('login',function(data){
  frameModule.topmost().navigate({moduleName:'main-page',context:{username:pageData.get("username")}})
})
