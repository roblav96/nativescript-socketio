"use strict";
var application = require('application');
var moment = require("moment");
application.start({ moduleName: 'login' });
application.resources['timeFromNow'] = function (date) {
    return moment(date).fromNow();
};
