var zlib = require('zlib');
var mapnik = require('mapnik');
var tilejson = require('tilejson');
var tilelive = require('tilelive');
var path = require('path');
var temp = require('temp');
var fs = require('fs');

temp.track();
tilejson.registerProtocols(tilelive);

var PbfDumper = function(tileJson, callback) {
    if (!tileJson.format && !tileJson.format === 'pbf') 
        return callback(new Error('Must provide valid TileJSON for a pbf source'));

    var tilejsonPath = temp.path({suffix: '.json'});
    var uri = 'tilejson://' + tilejsonPath;
    fs.writeFileSync(tilejsonPath, JSON.stringify(tileJson));

    tilelive.load(uri, sourceLoaded);
    
    function sourceLoaded(err, source) {
        if (err) return callback(err);

        function getTile(coords, callback) { 
            var z = Number(coords[0]),
                x = Number(coords[1]),
                y = Number(coords[2]),
                size;

            source.getTile(z, x, y, gotTile);

            function gotTile(err, tile, options) {
                if (err) return callback(err);
                size = tile.length;
                zlib.inflate(tile, inflated);
            }

            function inflated(err, tile) {
                if (err) return callback(err);
                var vtile = new mapnik.VectorTile(z, x, y);
                vtile.setData(tile);
                vtile.parse(function(err) {
                    if (err) return callback(err);            
                    callback(null, vtile.toGeoJSON('__array__'), vtile, size);
                });
            }
        }

        callback(null, getTile);
    }
}

module.exports = PbfDumper;
