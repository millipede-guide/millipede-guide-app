/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const FS = require('fs');
const Glob = require('glob');
const YAML = require('js-yaml');
const Path = require('path');
const MkDir = typeof window === 'undefined' ? require('mkdirp') : null;
const tokml = require('tokml');
const togpx = require('togpx');
const { docToGeoJson } = require('./docToGeoJson');
// const data2xml = require('data2xml')();

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
            docToGeoJson(category, doc, geo);
            FS.writeFileSync(
                Path.join(exportDir, `${fileName}.geo.json`),
                JSON.stringify(geo, null, 4),
            );

            FS.writeFileSync(Path.join(exportDir, `${fileName}.kml`), tokml(geo));

            FS.writeFileSync(Path.join(exportDir, `${fileName}.gpx`), togpx(geo));
        }
    });
});
