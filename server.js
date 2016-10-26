'use strict';

var express, app, port;

express = require('express');
app = express();
port = 9001;

// app.use('/favicon.png', express.static(__dirname + '/app/favicon.png'));
app.use('/ui', express.static(__dirname + '/app/ui'));
app.use('/vendor', express.static(__dirname + '/app/vendor'));
app.all('/*', function(req, res, next) {
    res.sendfile('index.html', {root: __dirname + '/app'});
});

app.listen(port, function() {
    console.log('Start server on port %d', port);
});