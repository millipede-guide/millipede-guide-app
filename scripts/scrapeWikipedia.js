// https://nominatim.org/release-docs/develop/api/Search/

import FS from 'fs';
import YAML from 'js-yaml';
import Glob from 'glob';
import Path from 'path';
import _omitBy from 'lodash/omitBy.js';
import cheerio from 'cheerio';
import URL from 'url';
import get from './scrapers/get.js';
import sleep from './scrapers/sleep.js';

const dirPath = process.argv[process.argv.length - 1];

const officialHostnames = ['nationalparks.nsw.gov.au'];

const run = async () => {
    let limit = 1000000000;

    for (const filePath of Glob.sync(Path.join(dirPath, '/**/*.yaml'))) {
        const doc = YAML.safeLoad(FS.readFileSync(filePath));

        let updated = false;

        if (doc.links !== undefined && doc.links.wikipedia) {
            console.log(filePath);
            console.log(' -->', doc.links.wikipedia);

            const html = await get(doc.links.wikipedia);

            if (html) {
                const $ = cheerio.load(html);

                const ogImage = $('meta[property="og:image"]').first();

                if (ogImage) {
                    const src = $(ogImage).attr('content');
                    if (src) {
                        if (src && /wikimedia/.test(src) && !/relief_location_map/.test(src)) {
                            console.log('   photo:', src);
                            if (!doc.photos || !doc.photos.map((i) => i.src).includes(src)) {
                                doc.photos = [
                                    {
                                        src,
                                        href: src,
                                        attr: 'Wikimedia',
                                        licence: 'wikimedia',
                                    },
                                    ...(doc.photos || []),
                                ];
                                updated = true;
                            }
                        }
                    }
                }

                if (!doc.links.official) {
                    $('a.external').each((i, a) => {
                        const href = $(a).attr('href');
                        const url = URL.parse(URL.resolve(doc.links.wikipedia, href));
                        if (
                            url.path.length > 1 &&
                            officialHostnames.includes(url.hostname.replace(/^www./, ''))
                        ) {
                            if (!doc.links.official) {
                                console.log('   official:', href);
                                doc.links.official = href;
                                updated = true;
                            }
                        }
                    });
                }

                if (updated) {
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

            limit -= 1;
            if (limit === 0) return;

            console.log('---');
            await sleep(Math.floor(Math.random() * Math.floor(10)));
        }
    }
};

if (FS.existsSync(dirPath)) {
    run().then(() => console.log('Done.'));
}
