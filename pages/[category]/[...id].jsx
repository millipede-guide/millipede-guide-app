import Glob from 'glob';
import Path from 'path';
import FS from 'fs';
import YAML from 'js-yaml';
import Page from '../../components/Page';

export const getStaticPaths = async () => {
    const paths = ['routes', 'parks', 'attractions', 'campsites'].reduce((acc, category) => {
        return acc.concat(
            Glob.sync(Path.join('**', '*.yaml'), {
                cwd: Path.join('public', 'docs', category),
            }).map((f) => ({
                params: {
                    category,
                    id: f.replace(/.yaml$/, '').split('/'),
                },
            })),
        );
    }, []);

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps = async ({ params }) => {
    const { category } = params;
    const id = Path.join(...params.id);
    const fileName = id;
    const filePath = Path.join('public', 'docs', category, `${fileName}.yaml`);
    const content = FS.readFileSync(filePath);
    const doc = YAML.safeLoad(content);

    return {
        props: {
            category,
            id,
            doc,
            fileName,
        },
    };
};

export default Page;
