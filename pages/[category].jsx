import FS from 'fs';
import Glob from 'glob';
import YAML from 'js-yaml';
import Path from 'path';
import IndexList from '../components/IndexList';
import getFeaturePhoto from '../utils/getFeaturePhoto';

export const getStaticPaths = async () => {
    return {
        paths: ['routes', 'parks', 'attractions', 'campsites'].map((category) => ({
            params: { category },
        })),
        fallback: false,
    };
};

export const getStaticProps = async ({ params }) => {
    const { category } = params;
    const dir = Path.join('public', 'content', category);

    const geo = {
        type: 'FeatureCollection',
        features: Glob.sync(Path.join('**', '*.yaml'), {
            cwd: dir,
        })
            .sort()
            .map((f) => {
                const id = f.replace(/.yaml$/, '');
                const doc = YAML.safeLoad(FS.readFileSync(Path.join(dir, f)));

                if (doc.draft !== 't') {
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [doc.location[1] || 0, doc.location[0] || 0],
                        },
                        properties: {
                            id,
                            href: `/${category}/${id}`,
                            type: category.replace(/s$/, ''),
                            name: doc.name || Path.basename(id),
                            country: doc.country || null,
                            region: doc.region || null,
                            park: doc.park || null,
                            location: doc.location || null,
                            photo: getFeaturePhoto(doc.photos),
                            features: doc.features || null,
                            restrictions: doc.restrictions || null,
                            accessibility: doc.accessibility || null,
                            getting_there: doc.getting_there || null,
                        },
                    };
                }
                return null;
            })
            .filter((i) => i !== null),
    };

    return {
        props: {
            category,
            geo,
        },
    };
};

export default IndexList;
