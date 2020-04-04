const humanize = require('underscore.string/humanize');
const photoIndex = require('../public/photos/index.json');

module.exports.docToGeoJson = (doc, geo) => {
    ['parking', 'water', 'toilets'].forEach(k => {
        if (doc[k]) {
            doc[k].forEach(({ name, location, photos, gender }) => {
                if (location) {
                    geo.features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [location[1], location[0]],
                        },
                        properties: {
                            type:
                                k === 'toilets' && (gender === 'm' || gender === 'f')
                                    ? `toilets_${gender}`
                                    : k,
                            name: humanize(k) + (name ? ` - ${name}` : ''),
                            photo: photos && photos.length >= 1 ? photos[0] : null,
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
                            src: `/photos/sm/${photoIndex[src].cache}`,
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
