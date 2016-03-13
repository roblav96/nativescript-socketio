'use strict'
let Observable = require('data/observable').Observable;
let ObservableArray = require('data/observable-array').ObservableArray;
let SocketIO = require('nativescript-socketio');
let pages = require('ui/page');
let frameModule = require('ui/frame');
let pageData = new Observable({
  list: new ObservableArray(),
  textMessage:''
})
let page;
let context;
// Event handler for Page "loaded" event attached in main-page.xml
exports.pageLoaded = function(args) {
    // Get the event sender
    page = args.object;
    page.bindingContext = pageData;
      context = page.navigationContext;
      SocketIO.emit('getMessages');
}
exports.sendText = function(){
  let data = {
            username:context.username,
            message:pageData.get("textMessage"),
            timeStamp:+new Date()
          };
  SocketIO.emit('new message',data)
pageData.list.push(data);
pageData.set("textMessage","");
}

SocketIO.on('new message',function(data){
pageData.list.push(JSON.parse(data))
})

SocketIO.on('disconnect',function(){
  frameModule.topmost().navigate('login')
})

SocketIO.on('getMessages',function(data){
 /* if(data.length > 0){
    var messages = JSON.parse(data);
    console.log(messages.length)
    for(let i=0;i < messages.length;i++){
      console.log(messages[i])
    }

  }*/

})
