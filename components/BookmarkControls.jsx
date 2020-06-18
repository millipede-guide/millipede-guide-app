import IconButton from '@material-ui/core/IconButton';
import Moment from 'moment';
import { useContext, useState } from 'react';
import { StorageContext, setPageCache } from './Storage';
import { BookmarkIcon } from './Bookmarks';
import BookmarkDialog from './BookmarkDialog';

export const dateStorageFormat = 'YYYY-MM-DD';
export const dateDisplayFormat = 'Do MMM YYYY';

export default ({ category, id, doc, userUpdate = false, size = 'medium' }) => {
    const bookmark = 'mark';
    const completed = 'done';
    const favourite = 'favt';

    const [storage, setStorage] = useContext(StorageContext);
    const [dialog, setDialog] = useState(null);

    const get = (i) => {
        try {
            const { log } = storage.pageData[category][id][i];
            return log !== undefined && log.length > 0;
        } catch (e) {
            return false;
        }
    };

    const getTime = (i) => {
        try {
            const { log } = storage.pageData[category][id][i];
            if (log === undefined && log.length === 0) {
                return '';
            }
            return ` - ${Moment(log[0], dateStorageFormat).format(dateDisplayFormat)}`;
        } catch (e) {
            return '';
        }
    };

    const toggle = (i) => {
        const t = Moment().format(dateStorageFormat);

        setPageCache(setStorage, category, id, doc);

        setStorage({
            type: 'pageData',
            category,
            id,
            userUpdate,
            key: i,
            val: {
                log: get(i) ? [] : [t],
                at: t,
            },
        });

        return t;
    };

    return (
        <>
            <IconButton
                disabled={!storage.available}
                size={size}
                title={`Bookmark${getTime(bookmark)}`}
                onClick={() => toggle(bookmark)}
                color="primary"
            >
                <BookmarkIcon type={bookmark} color="inherit" active={get(bookmark)} />
            </IconButton>
            <IconButton
                disabled={!storage.available}
                size={size}
                title={`Completed${getTime(completed)}`}
                onClick={() => setDialog([completed])}
                color="primary"
            >
                <BookmarkIcon type={completed} color="inherit" active={get(completed)} />
            </IconButton>
            <IconButton
                disabled={!storage.available}
                size={size}
                title={`Favourite${getTime(favourite)}`}
                onClick={() => toggle(favourite)}
                color="primary"
            >
                <BookmarkIcon type={favourite} color="inherit" active={get(favourite)} />
            </IconButton>
            <BookmarkDialog
                category={category}
                id={id}
                doc={doc}
                attr={dialog}
                setAttr={setDialog}
                dateStorageFormat={dateStorageFormat}
                dateDisplayFormat={dateDisplayFormat}
            />
        </>
    );
};
