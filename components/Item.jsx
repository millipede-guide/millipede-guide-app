import Page from './Page';
import loadFile from '../utils/loadFile';

const Item = props => <Page {...props} />;

Item.getInitialProps = async function loadData(context) {
    const dir = context.asPath.split('/').filter(i => i !== '')[0];
    const { id } = context.query;
    const { content: doc, path: jsonUrl } = await loadFile(
        `/export/${dir}`,
        context.query.id,
        'json',
    );
    return { dir, id, doc, jsonUrl };
};

export default Item;
