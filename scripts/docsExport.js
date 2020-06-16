/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import FS from 'fs';
import Glob from 'glob';
import YAML from 'js-yaml';
import Path from 'path';
import MkDir from 'mkdirp';
import tokml from 'tokml';
import togpx from 'togpx';
import docToGeoJson from '../utils/docToGeoJson.js';
// const data2xml = require('data2xml')();

const photosIndex = JSON.parse(FS.readFileSync('./public/photos/index.json'));

['attractions', 'campsites', 'parks', 'routes'].forEach((category) => {
    Glob.sync(`public/docs/${category}/**/*.yaml`).forEach((filePath) => {
        console.log(' ', filePath);

        const exportDir = Path.dirname(filePath).replace('/docs/', '/export/');
        const fileName = Path.basename(filePath, '.yaml');

        MkDir.sync(exportDir);

        console.log(`  => ${exportDir}`);

        const yaml = FS.readFileSync(filePath);
        FS.writeFileSync(Path.join(exportDir, `${fileName}.yaml`), yaml);

        const doc = YAML.safeLoad(yaml);

        if (doc.draft !== 't') {
            FS.writeFileSync(
                Path.join(exportDir, `${fileName}.json`),
                JSON.stringify(doc, null, 4),
            );

            // FS.writeFileSync(Path.join(exportDir, fileName + '.xml'), data2xml('document', doc));

            const geoBaseFilePath = filePath.replace('.yaml', '.geo.json');
            let geo;
            if (FS.existsSync(geoBaseFilePath)) {
                geo = JSON.parse(FS.readFileSync(geoBaseFilePath));
            } else {
                geo = {
                    type: 'FeatureCollection',
                    features: [],
                };
            }
            docToGeoJson(category, doc, geo, photosIndex);
            FS.writeFileSync(
                Path.join(exportDir, `${fileName}.geo.json`),
                JSON.stringify(geo, null, 4),
            );

            FS.writeFileSync(Path.join(exportDir, `${fileName}.gpx`), togpx(geo));

            /* eslint-disable no-param-reassign */
            geo.features.forEach((i) => {
                // KML can't handle objects in features:
                delete i.properties.osm;
                delete i.properties.tags;
            });
            /* eslint-enable no-param-reassign */

            FS.writeFileSync(Path.join(exportDir, `${fileName}.kml`), tokml(geo));
        }
    });
});
