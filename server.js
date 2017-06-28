'use strict';

/**
 * Module dependencies.
 */
var throng = require('throng');

var WORKERS = process.env.WEB_CONCURRENCY || 1;

var app = require('./lib/app');
var config = require('./config/env/local');
// var alertsService = require('./lib/services/alertsService')();



// throng({
//     workers: WORKERS,
//     // master: alertsService.start,
//     lifetime: Infinity
// },start);

start();
function start() {
    var appInstance = app.start(config);
}

