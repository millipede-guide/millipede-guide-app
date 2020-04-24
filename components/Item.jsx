import Page from './Page';
import loadFile from '../utils/loadFile';

const devEnv = process.env.NODE_ENV === 'development';

const YAML = devEnv ? require('js-yaml') : null;

const Item = (props) => <Page {...props} />;

Item.getInitialProps = async function loadData(context) {
    const category = context.asPath.split('/').filter((i) => i !== '')[0];
    const { id } = context.query;
    const fileName = id.split('~').reverse().join('/');
    const filePath = devEnv
        ? `/docs/${category}/${fileName}.yaml`
        : `/export/${category}/${fileName}.json`;
    const content = await loadFile(filePath);
    const doc = devEnv ? YAML.safeLoad(content) : JSON.parse(content);
    return { category, id, fileName, doc };
};

export default Item;
