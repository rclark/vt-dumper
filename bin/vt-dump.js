#!/usr/bin/env node

var vtDumper = require('../');
var path = require('path');
var fs = require('fs');

while (process.argv.shift() !== __filename) {}

if (process.argv.length < 1) return console.log('You must specify the path to valid TileJSON');
if (process.argv.length < 2) return console.log('You must specify a tile coordinate as [z, x, y]');

var tilejson = fs.readFileSync(path.resolve(process.argv[0]));
var tilecoord = JSON.parse(process.argv[1]);

vtDumper(JSON.parse(tilejson), function (err, getTile) {
    if (err) return console.log(err);
    getTile(tilecoord, function (err, geojson, vtile, size) {
        if (err) return console.log(err);
        console.log(geojson);
    });
});
