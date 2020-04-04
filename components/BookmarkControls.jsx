import IconButton from '@material-ui/core/IconButton';
import BookmarkOnIcon from 'mdi-material-ui/Star';
import BookmarkOffIcon from 'mdi-material-ui/StarOutline';
import CompletedOnIcon from 'mdi-material-ui/CheckCircle';
import CompletedOffIcon from 'mdi-material-ui/CheckCircleOutline';
import FavouriteOnIcon from 'mdi-material-ui/Heart';
import FavouriteOffIcon from 'mdi-material-ui/HeartOutline';
import { StorageContext } from './Storage';

const Control = ({ dir, id, size = 'medium', storage, setStorage }) => {
    const bookmark = 'mark';
    const completed = 'done';
    const favourite = 'favt';

    const get = i => {
        try {
            return storage.pageData[dir][id][i];
        } catch (e) {
            return false;
        }
    };

    const set = i => setStorage({ type: 'pageData', dir, id, key: i, val: !get(i) });

    return (
        <>
            <IconButton
                disabled={!storage.available}
                size={size}
                title="Bookmark"
                onClick={() => set(bookmark)}
                color="primary"
                style={{ color: get(bookmark) ? 'gold' : '' }}
            >
                {get(bookmark) ? <BookmarkOnIcon /> : <BookmarkOffIcon />}
            </IconButton>
            <IconButton
                disabled={!storage.available}
                size={size}
                title="Completed"
                onClick={() => set(completed)}
                color="primary"
                style={{ color: get(completed) ? 'green' : '' }}
            >
                {get(completed) ? <CompletedOnIcon /> : <CompletedOffIcon />}
            </IconButton>
            <IconButton
                disabled={!storage.available}
                size={size}
                title="Favourite"
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
