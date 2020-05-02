const humanize = require('underscore.string/humanize');
const photoIndex = require('../public/photos/index.json');
const { singular } = require('./mapMarkers');

const coordinates = (ary) => [ary[1], ary[0]];

const geoFeatures = (key, ary) =>
    ary
        .filter((i) => i.show !== false)
        .filter((i) => i.location !== undefined)
        .map(({ osm, location, name, photos, tags }) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates(location),
            },
            properties: {
                type: singular[key] || key,
                osm,
                name: humanize(key) + (name ? ` - ${name}` : ''),
                photo:
                    photos && photos.length >= 1
                        ? {
                              ...photos[0],
                              src: `/photos/sm/${photoIndex[photos[0].src].hash}.jpg`,
                          }
                        : null,
                tags,
            },
        }));

const objToGeoFeatures = (category, obj) =>
      Object.keys(obj).filter(key => singular[key] !== singular[category]).reduce((features, key) => {
        return [...features, ...geoFeatures(key, obj[key] || [])];
    }, []);

const geoPhotos = (ary) =>
    ary
        .filter((i) => i.show !== false)
        .filter((i) => i.location || photoIndex[i.src].location)
        .map(({ src, href, attr, license, location }) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates(location || photoIndex[src].location),
            },
            properties: {
                type: 'photo',
                name: 'Photo',
                photo: {
                    src: `/photos/sm/${photoIndex[src].hash}.jpg`,
                    href,
                    attr,
                    license,
                },
            },
        }));

module.exports.docToGeoJson = (category, doc, geoBase) => {
    return {
        ...geoBase,
        features: [
            ...geoBase.features,
            ...objToGeoFeatures(category, doc.infrastructure || {}),
            ...objToGeoFeatures(category, doc.natural || {}),
            ...geoPhotos(doc.photos || []),
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates(doc.location),
                },
                properties: {
                    type: singular[category],
                    name: doc.name,
                },
            },
        ],
    };
};
