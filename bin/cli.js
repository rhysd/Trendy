#! /usr/bin/env node

'use strict';

var child_process = require('child_process');
var electron = require('electron-prebuilt');
var join = require('path').join;
var existsSync = require('fs').existsSync;

var argv = [join(__dirname, '..')];
var detach_idx = process.argv.indexOf('--detach');
var detached = detach_idx !== -1;
if (detached) {
    process.argv.splice(detach_idx, 1);
}

if (detached) {
    child_process.spawn(electron, argv, {
        stdio: 'ignore',
        detached: true
    }).unref();
} else {
    child_process.spawn(electron, argv, {
        stdio: 'inherit'
    });
}
