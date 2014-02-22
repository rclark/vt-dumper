# pbf-dumper

Just a function to grab a single vector tile. You provide:
- [TileJSON](https://github.com/mapbox/tilejson-spec) that indicates where to get the tile from
- Tile coordinates to grab, as an array of `[z, x, y]`

## Example usage

```javascript
var pbfDump = require('pbf-dumper');
var fs = require('fs');
var tilejson = JSON.parse(fs.readFileSync('/path/to/tilejson.json'));
var coords = [ 1, 0, 1 ];

// Calling the `pbfDump` function loads your data source
pbfDump(tilejson, function(err, getTile) {
    // Any errors would be related to loading your TileJSON
    if (err) throw err;

    // Callback gives you a function that you can use to make tile requests
    getTile(coords, function(err, geojson, vtile, size) {
        // If there were errors loading your tile...
        if (err) throw err;

        // Otherwise you have 
        // - `vtile`: the mapnik vector tile, 
        // - `size`: its compressed size, and 
        // - `geojson`: a GeoJSON representation of the data as an array
        //     of FeatureCollections, one for each layer in the tile.
        doSomethingWith(geojson);
    });
});