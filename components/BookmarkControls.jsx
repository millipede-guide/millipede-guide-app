import IconButton from '@material-ui/core/IconButton';
import Moment from 'moment';
import { StorageContext } from './Storage';
import { BookmarkIcon } from './Bookmarks';

const Control = ({ category, id, userUpdate = false, size = 'medium', storage, setStorage }) => {
    const bookmark = 'mark';
    const completed = 'done';
    const favourite = 'favt';

    const get = i => {
        try {
            const prop = storage.pageData[category][id][i];
            return typeof prop === 'boolean' ? prop : prop.v;
        } catch (e) {
            return false;
        }
    };

    const getTime = i => {
        try {
            const prop = storage.pageData[category][id][i];
            if (typeof prop === 'boolean' || !prop.v) {
                return '';
            }
            return Moment()
                .utc(prop.t)
                .local()
                .format(' (Do MMM YYYY)');
        } catch (e) {
            return '';
        }
    };

    const set = i =>
        setStorage({
            type: 'pageData',
            category,
            id,
            userUpdate,
            key: i,
            val: {
                v: !get(i),
                t: [
                    Moment()
                        .utc()
                        .format('X'),
                ],
            },
        });

    return (
        <>
            <IconButton
                disabled={!storage.available}
                size={size}
                title={`Bookmark${getTime(bookmark)}`}
                onClick={() => set(bookmark)}
                color="primary"
            >
                <BookmarkIcon type={bookmark} color="inherit" active={get(bookmark)} />
            </IconButton>
            <IconButton
                disabled={!storage.available}
                size={size}
                title={`Completed${getTime(completed)}`}
                onClick={() => set(completed)}
                color="primary"
            >
                <BookmarkIcon type={completed} color="inherit" active={get(completed)} />
            </IconButton>
            <IconButton
                disabled={!storage.available}
                size={size}
                title={`Favourite${getTime(favourite)}`}
                onClick={() => set(favourite)}
                color="primary"
            >
                <BookmarkIcon type={favourite} color="inherit" active={get(favourite)} />
            </IconButton>
        </>
    );
};

export default props => (
    <StorageContext.Consumer>
        {([storage, setStorage]) => (
            <Control storage={storage} setStorage={setStorage} {...props} />
        )}
    </StorageContext.Consumer>
);
