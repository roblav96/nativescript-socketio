import application = require('application');
import moment = require("moment");
application.start({ moduleName: 'login' });
application.resources['timeFromNow'] = function(date){
    return moment(date).fromNow();
}