import IconButton from '@material-ui/core/IconButton';
import BookmarkOnIcon from 'mdi-material-ui/Star';
import BookmarkOffIcon from 'mdi-material-ui/StarOutline';
import CompletedOnIcon from 'mdi-material-ui/CheckCircle';
import CompletedOffIcon from 'mdi-material-ui/CheckCircleOutline';
import FavouriteOnIcon from 'mdi-material-ui/Heart';
import FavouriteOffIcon from 'mdi-material-ui/HeartOutline';
import Moment from 'moment';
import { StorageContext } from './Storage';

const Control = ({ dir, id, userUpdate = false, size = 'medium', storage, setStorage }) => {
    const bookmark = 'mark';
    const completed = 'done';
    const favourite = 'favt';

    const get = i => {
        try {
            const prop = storage.pageData[dir][id][i];
            return typeof prop === 'boolean' ? prop : prop.v;
        } catch (e) {
            return false;
        }
    };

    const getTime = i => {
        try {
            const prop = storage.pageData[dir][id][i];
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
            dir,
            id,
            userUpdate,
            key: i,
            val: {
                v: !get(i),
                t: Moment()
                    .utc()
                    .format('X'),
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
                style={{ color: get(bookmark) ? 'gold' : '' }}
            >
                {get(bookmark) ? <BookmarkOnIcon /> : <BookmarkOffIcon />}
            </IconButton>
            <IconButton
                disabled={!storage.available}
                size={size}
                title={`Completed${getTime(completed)}`}
                onClick={() => set(completed)}
                color="primary"
                style={{ color: get(completed) ? 'green' : '' }}
            >
                {get(completed) ? <CompletedOnIcon /> : <CompletedOffIcon />}
            </IconButton>
            <IconButton
                disabled={!storage.available}
                size={size}
                title={`Favourite${getTime(favourite)}`}
                onClick={() => set(favourite)}
                color="primary"
                style={{ color: get(favourite) ? 'red' : '' }}
            >
                {get(favourite) ? <FavouriteOnIcon /> : <FavouriteOffIcon />}
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
