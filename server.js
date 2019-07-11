'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');

require('./server/express.js')(app);

app.use(cors());
app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});