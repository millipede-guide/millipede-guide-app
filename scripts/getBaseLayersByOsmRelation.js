// https://nominatim.org/release-docs/develop/api/Search/

import FS from 'fs';
import YAML from 'js-yaml';
import Glob from 'glob';
import Path from 'path';
import { osmBaseLayerQuery } from './utils/osm.js';

const dirPath = process.argv[process.argv.length - 1];

const sleep = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
};

const geoTypes = ['MultiPolygon', 'Polygon', 'LineStrings', 'LineString', 'Point'];

const updateDocuments = async () => {
    let limit = 10000;

    for (const filePath of Glob.sync(Path.join(dirPath, '/**/*.yaml'))) {
        const geoJsonPath = filePath.replace('.yaml', `.geo.json`);

        if (!FS.existsSync(geoJsonPath)) {
            const doc = YAML.safeLoad(FS.readFileSync(filePath));

            if (doc.osm && doc.osm.relation) {
                console.log(filePath);

                const geo = await osmBaseLayerQuery(
                    { relation: doc.osm.relation },
                    false,
                    geoJsonPath,
                );

                for (const geoType of geoTypes) {
                    console.log(
                        ' -->',
                        geoType,
                        geo.features.filter((f) => f.geometry.type === geoType).length,
                    );
                }

                limit -= 1;
                if (limit === 0) return;

                await sleep(30);
            }
        }
    }
};

updateDocuments().then(() => console.log('Done.'));
