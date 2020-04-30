import YAML from 'js-yaml';
import Page from './Page';
import loadFile from '../utils/loadFile';

const Item = (props) => <Page {...props} />;

Item.getInitialProps = async function loadData(context) {
    const category = context.asPath.split('/').filter((i) => i !== '')[0];
    const { id } = context.query;
    const fileName = id.split('~').reverse().join('/');
    const filePath = `/docs/${category}/${fileName}.yaml`;
    const content = await loadFile(filePath);
    const doc = YAML.safeLoad(content);
    return { category, id, fileName, doc };
};

export default Item;
