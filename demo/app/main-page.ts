import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import {Page, NavigatedData} from 'ui/page';
import frameModule = require('ui/frame');
import SocketIO = require('nativescript-socketio');
import view = require('ui/core/view');
let pageData: any = new Observable({
  list: new ObservableArray(),
  textMessage: '',
  currentUser:''
})
let page;
let context;
export function navigatingTo(args:NavigatedData){
   page = <Page>args.object;
  context = page.navigationContext;
  pageData.set("currentUser",context.username);
}
export function pageLoaded(args: NavigatedData) {
  page.bindingContext = pageData;
  SocketIO.emit('getMessages');
}
export function sendText() {
  let data = {
    username: context.username,
    message: pageData.get("textMessage"),
    timeStamp: +new Date()
  };

  SocketIO.emit('new message', data)
  pageData.list.push(data);
  pageData.set("textMessage", "");
}

SocketIO.on('new message', function(data) {
  pageData.list.push(JSON.parse(data))
})

SocketIO.on('disconnect', function() {
  pageData.list.push.length = 0;
  frameModule.topmost().navigate('login')
})

SocketIO.on('getMessages', function(data) {
  if (data.length > 0) {
    if (pageData.list.length !== data.length) {
      var messages = data;
      for (let i = 0; i < messages.length; i++) {
        pageData.list.push(messages[i])
      }
    }
  }

})
