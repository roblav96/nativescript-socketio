import {Observable} from 'data/observable';
import socketIO = require('nativescript-socketio');
import {} from 'ui/page';
import frameModule = require('ui/frame');
socketIO.init('http://192.168.56.1:3000', {});
let pageData = new Observable({
  item: '',
  username: 'Osei'
})
export function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = pageData;
}
export function join(args) {
  socketIO.emit('add user', { username: pageData.get("username") })
}

socketIO.on('login', function(data) {
  frameModule.topmost().navigate({ moduleName: 'main-page', context: { username: pageData.get("username") } })
})
