/* eslint-disable no-console */

const FS = require('fs');
const Glob = require('glob');
const YAML = require('js-yaml');
const Path = require('path');
const photoIndex = require('../public/photos/index.json');
const { getFeaturePhoto } = require('../utils/getFeaturePhoto');

const makeUrlId = (filePath) => filePath.replace('.yaml', '').split('/').reverse().join('~');

const photoObj = (photos) => {
    if (photos) {
        const photo = getFeaturePhoto(photos);
        if (photo) {
            return {
                ...photo,
                src: `/photos/sm/${photoIndex[photo.src].hash}.jpg`,
            };
        }
    }
    return null;
};

['routes', 'attractions', 'campsites', 'parks'].forEach((category) => {
    const dir = Path.join('public', 'docs', category);

    const geo = {
        type: 'FeatureCollection',
        features: Glob.sync(Path.join(dir, '**', '*.yaml'))
            .sort()
            .map((f) => [makeUrlId(f.replace(`${dir}/`, '')), YAML.safeLoad(FS.readFileSync(f))])
            .filter(([, doc]) => doc.draft !== 't')
            .map(([id, doc]) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [doc.location[1], doc.location[0]],
                },
                properties: {
                    id,
                    href: `/${category}/${id}/`,
                    type: category,
                    name: doc.name,
                    country: doc.country,
                    region: doc.region,
                    park: doc.park,
                    location: doc.location,
                    photo: photoObj(doc.photos),
                    features: doc.features,
                    restrictions: doc.restrictions,
                    accessibility: doc.accessibility,
                    getting_there: doc.getting_there,
                },
            })),
    };

    FS.writeFileSync(`public/export/${category}/index.geo.json`, JSON.stringify(geo, null, 4));
});
