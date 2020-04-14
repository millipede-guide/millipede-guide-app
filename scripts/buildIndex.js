/* eslint-disable no-console */

const FS = require('fs');
const Glob = require('glob');
const YAML = require('js-yaml');
const Path = require('path');
const photoIndex = require('../public/photos/index.json');
const { getFeaturePhoto } = require('../utils/getFeaturePhoto');

const makeUrlId = filePath =>
    filePath
        .replace('.yaml', '')
        .split('/')
        .reverse()
        .join('~');

const photoObj = photo => {
    if (photo) {
        return {
            ...photo,
            src: `/photos/sm/${photoIndex[photo.src].hash}.jpg`,
        };
    }
    return null;
};

function makeGeoFeature(dirPath, filePath) {
    const doc = YAML.safeLoad(FS.readFileSync(Path.join(dirPath, filePath)));

    return doc.draft === 't'
        ? null
        : {
              type: 'Feature',
              geometry: {
                  type: 'Point',
                  coordinates: [doc.location[1], doc.location[0]],
              },
              properties: {
                  id: makeUrlId(filePath),
                  type: 'marker',
                  name: doc.name,
                  country: doc.country,
                  region: doc.region,
                  park: doc.park,
                  photo: photoObj(getFeaturePhoto(doc.photos)),
              },
          };
}

['routes', 'attractions', 'campsites', 'parks'].forEach(category => {
    const dirPath = `public/docs/${category}`;

    const geo = {
        type: 'FeatureCollection',
        features: Glob.sync('**/*.yaml', {
            cwd: dirPath,
        })
            .sort()
            .map(i => makeGeoFeature(dirPath, i))
            .filter(Boolean),
    };

    FS.writeFileSync(`public/export/${category}/index.geo.json`, JSON.stringify(geo, null, 4));
});
