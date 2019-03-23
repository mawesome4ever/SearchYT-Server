
const express        = require('express');
const app            = express();
const https          = require('https');
var path             = require('path');
var fs               = require('fs');

const port = 8000;//the port you want the server to run on
require('./app/routes')(app, {});
app.listen(port, () => {
  console.log('We are live on ' + port);
});
