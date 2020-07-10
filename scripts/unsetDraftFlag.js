// https://nominatim.org/release-docs/develop/api/Search/

import FS from 'fs';
import YAML from 'js-yaml';
import Glob from 'glob';
import Path from 'path';
import _omitBy from 'lodash/omitBy.js';

const dirPath = process.argv[process.argv.length - 1];

const updateDocuments = async () => {
    for (const filePath of Glob.sync(Path.join(dirPath, '/**/*.yaml'))) {
        const { draft, ...doc } = YAML.safeLoad(FS.readFileSync(filePath));

        if (draft !== undefined) {
            console.log(filePath);

            FS.writeFileSync(
                filePath,
                YAML.safeDump(
                    _omitBy(doc, (i) => i === undefined),
                    {
                        lineWidth: 1000,
                        noRefs: true,
                    },
                ),
            );
        }
    }
};

updateDocuments().then(() => console.log('Done.'));
