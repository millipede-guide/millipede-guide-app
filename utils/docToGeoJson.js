import humanize from 'underscore.string/humanize.js';
import { singular } from './mapMarkers.js';

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
                osm: osm || {},
                name: humanize(key) + (name ? ` - ${name}` : ''),
                photo: photos && photos.length >= 1 ? photos[0] : null,
                tags: tags || [],
            },
        }));

const objToGeoFeatures = (category, obj) =>
    Object.keys(obj)
        .filter((key) => singular[key] !== singular[category])
        .reduce((features, key) => {
            return [...features, ...geoFeatures(key, obj[key] || [])];
        }, []);

const geoPhotos = (ary, photosIndex) =>
    ary
        .filter((i) => i.show !== false)
      .filter((i) => i.location || (photosIndex[i.src] && photosIndex[i.src].location))
        .map(({ src, href, attr, license, location }) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates(location || photosIndex[src].location),
            },
            properties: {
                type: 'photo',
                name: 'Photo',
                photo: {
                    src,
                    href,
                    attr,
                    license,
                },
            },
        }));

export default (category, doc, geoBase, photosIndex) => {
    return {
        ...geoBase,
        features: [
            ...geoBase.features,
            ...objToGeoFeatures(category, doc.infrastructure || {}),
            ...objToGeoFeatures(category, doc.natural || {}),
            ...geoPhotos(doc.photos || [], photosIndex),
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
