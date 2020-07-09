// https://nominatim.org/release-docs/develop/api/Search/

import FS from 'fs';
import YAML from 'js-yaml';
import Glob from 'glob';
import Path from 'path';
import _omitBy from 'lodash/omitby.js';
import get from './scrapers/get.js';

const dirPath = process.argv[process.argv.length - 1];

const sleep = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
};

const types = ['national_park', 'protected_area', 'wood'];

const updateDocuments = async () => {
    let limit = 1000000;
    
    for (const filePath of Glob.sync(Path.join(dirPath, '/**/*.yaml'))) {
        // console.log(filePath);

        const {
            draft,
            name,
            country,
            region,
            location,
            osm,
            ...doc
        } = YAML.safeLoad(FS.readFileSync(filePath));

        if (!osm || Object.keys(osm).length === 0) {
            console.log(filePath);
            
            const url = `https://nominatim.openstreetmap.org/search/?street=${name}&country=${country}&format=json&limit=10`;
            // console.log(url);
            
            const body = await get(
                encodeURI(
                    url
                )
            );

            if (body) {
                const results = JSON.parse(body);

                console.log(results);
                
                // console.log(results);
                
                const area = results.filter((i) => i.osm_type === 'relation' && types.includes(i.type))[0];

                if (area) {
                    // console.log(area);
                    
                    console.log(' --> ', area.osm_id);
                    
                    FS.writeFileSync(
                        filePath,
                        YAML.safeDump(
                            _omitBy(
                                {
                                    // draft,
                                    name,
                                    country,
                                    region,
                                    location: [
                                        parseFloat(area.lat).toFixed(6),
                                        parseFloat(area.lon).toFixed(6),
                                    ],
                                    osm: { relation: area.osm_id },
                                    ...doc
                                },
                                (i) => i === undefined
                            ), {
                                lineWidth: 1000,
                                noRefs: true,
                            }),
                    );
                } else {
                    // console.log(results);
                }
            }

            limit -= 1;
            if (limit === 0) return;
            
            await sleep(5);
        }
    };
};

updateDocuments().then(() => console.log('Done.'));
