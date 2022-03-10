'use strict';

// load libraries
const gracefulShutdown = require('http-graceful-shutdown');
const app = require('./app.js');

// all code here will be executed on server shutdown
function onGracefulShutdown(){
    // I really don't know how useful this, if at all... :P
}

// options config for the http-graceful-shutdown library
const gracefulShutdownOpts = {
    timeout: 15000,
    forceExit: true,
    onShutdown: onGracefulShutdown
}

// start the app
var serve = app.listen(80)

// shut down gracefully
gracefulShutdown(serve, gracefulShutdownOpts);
