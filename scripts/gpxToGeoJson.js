/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const ToGeoJson = require('@mapbox/togeojson');
const FS = require('fs');
const Glob = require('glob');
const { DOMParser } = require('xmldom');

Glob.sync('public/docs/**/*.gpx').forEach(inPath => {
    console.log(inPath);
    const outPath = inPath.replace('.gpx', '.geo.json');
    if (FS.existsSync(outPath)) {
        console.log('  -> exists');
    } else {
        console.log('  -> convert');
        const gpx = FS.readFileSync(inPath).toString();
        const dom = new DOMParser().parseFromString(gpx);
        const geoJSON = ToGeoJson.gpx(dom);
        FS.writeFileSync(outPath, JSON.stringify(geoJSON, null, 4));
    }
});
