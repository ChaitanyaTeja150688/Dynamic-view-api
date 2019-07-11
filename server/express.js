'use strict';

module.exports = function(app) {
    const bodyParser = require('body-parser'),
          cookieParser = require('cookie-parser');


    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({limit: '50mb', extended: true}));

    const admin = require('./routes/admin'),
          user = require('./routes/user'),
          sharedApis = require('./routes/shared');
    app.use('/admin', admin);
    app.use('/user', user);
    app.use('/api', sharedApis);
}