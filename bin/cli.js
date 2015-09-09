#! /usr/bin/env node

'use strict';

var child_process = require('child_process');
var electron = require('electron-prebuilt');
var join = require('path').join;
var existsSync = require('fs').existsSync;

var argv = [join(__dirname, '..')];
var no_detach_idx = process.argv.indexOf('--no-detach');
var attached = no_detach_idx !== -1;
if (attached) {
    process.argv.splice(no_detach_idx, 1);
}

if (attached) {
    child_process.spawn(electron, argv, {
        stdio: 'inherit'
    });
} else {
    child_process.spawn(electron, argv, {
        stdio: 'ignore',
        detached: true
    }).unref();
}
