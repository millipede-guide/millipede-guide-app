/* eslint-disable no-console */

const FS = require('fs');
const Glob = require('glob');
const YAML = require('js-yaml');
const Path = require('path');
const photoIndex = require('../public/photos/index.json');

function makeUrlId(filePath) {
    return filePath
        .replace('.yaml', '')
        .split('/')
        .reverse()
        .join('~');
}

function makeObj(dirPath, filePath) {
    const doc = YAML.safeLoad(FS.readFileSync(Path.join(dirPath, filePath)));

    return {
        id: makeUrlId(filePath),
        name: doc.name,
        country: doc.country,
        region: doc.region,
        park: doc.park,
        location: doc.location,
        photos: (doc.photos || []).slice(0, 1),
    };
}

const photoObj = ({ src, href, attr, license }) => ({
    src: `/photos/sm/${photoIndex[src].cache}`,
    href,
    attr,
    license,
});

['routes', 'attractions', 'campsites', 'parks'].forEach(category => {
    const dirPath = `public/docs/${category}`;
    const index = Glob.sync('**/*.yaml', {
        cwd: dirPath,
    })
        .sort()
        .map(i => makeObj(dirPath, i));
    console.log(index);
    FS.writeFileSync(`public/export/${category}/index.json`, JSON.stringify(index, null, 4));

    const geo = {
        type: 'FeatureCollection',
        features: [],
    };

    index.forEach(({ id, name, location, photos }) => {
        geo.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [location[1], location[0]],
            },
            properties: {
                type: 'marker',
                name,
                category,
                id,
                photo: photos && photos.length >= 1 ? photoObj(photos[0]) : null,
            },
        });
    });

    FS.writeFileSync(`public/export/${category}/index.geo.json`, JSON.stringify(geo, null, 4));
});
