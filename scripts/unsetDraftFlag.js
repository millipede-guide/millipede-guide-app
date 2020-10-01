// https://nominatim.org/release-docs/develop/api/Search/

import FS from 'fs';
import YAML from 'js-yaml';
import Glob from 'glob';
import Path from 'path';
import _omitBy from 'lodash/omitBy.js';

const dirPath = process.argv[process.argv.length - 1];

const updateDocuments = async () => {
    for (const filePath of Glob.sync(Path.join(dirPath, '/**/*.yaml'))) {
        console.log(filePath);

        const {
            draft,
            // /////////
            name,
            country,
            region,
            location,
            osm,
            // /////////
            features,
            photos,
            // /////////
            links,
            copyright,
            license,
            // /////////
            ...doc
        } = YAML.safeLoad(FS.readFileSync(filePath));

        FS.writeFileSync(
            filePath,
            YAML.safeDump(
                _omitBy(
                    {
                        name,
                        country,
                        region,
                        location,
                        osm,
                        features,
                        ...doc,
                        photos,
                        links,
                        copyright,
                        license,
                    },
                    (i) => i === undefined,
                ),
                {
                    lineWidth: 1000,
                    noRefs: true,
                },
            ),
        );
    }
};

updateDocuments().then(() => console.log('Done.'));
