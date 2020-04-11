const humanize = require('underscore.string/humanize');
const photoIndex = require('../public/photos/index.json');

const type = (key, item) => {
    switch (key) {
        case 'toilets':
            return item.gender === 'm' || item.gender === 'f' ? `toilets_${item.gender}` : key;
        case 'transport':
            return item.type;
        default:
            return key;
    }
};

module.exports.docToGeoJson = (doc, geo) => {
    ['transport', 'parking', 'water', 'toilets', 'shelter'].forEach(key => {
        if (doc[key] !== undefined) {
            doc[key].forEach(item => {
                const { name, location, photos } = item;
                if (location) {
                    geo.features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [location[1], location[0]],
                        },
                        properties: {
                            type: type(key, item),
                            name: humanize(key) + (name ? ` - ${name}` : ''),
                            photo:
                                photos && photos.length >= 1
                                    ? {
                                          ...photos[0],
                                          src: `/photos/sm/${photoIndex[photos[0].src].hash}.jpg`,
                                      }
                                    : null,
                        },
                    });
                }
            });
        }
    });

    if (doc.photos) {
        doc.photos.forEach(({ src, href, attr, license, location }) => {
            const loc = location || photoIndex[src].location;
            if (loc) {
                geo.features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [loc[1], loc[0]],
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
                        icon: 'camera',
                    },
                });
            }
        });
    }

    if (doc.location) {
        geo.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [doc.location[1], doc.location[0]],
            },
            properties: {
                type: 'marker',
                name: doc.name,
                icon: 'map-marker',
            },
        });
    }

    return geo;
};
