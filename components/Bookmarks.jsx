import BookmarkOnIcon from 'mdi-material-ui/Star';
import CompletedOnIcon from 'mdi-material-ui/CheckCircle';
import FavouriteOnIcon from 'mdi-material-ui/Heart';
import BookmarkOffIcon from 'mdi-material-ui/StarOutline';
import CompletedOffIcon from 'mdi-material-ui/CheckCircleOutline';
import FavouriteOffIcon from 'mdi-material-ui/HeartOutline';
import Box from '@material-ui/core/Box';
import { useContext } from 'react';
import { StorageContext } from './Storage';

const bookmark = 'mark';
const completed = 'done';
const favourite = 'favt';

const icons = {
    [bookmark]: ['#ffd700', BookmarkOnIcon, BookmarkOffIcon],
    [completed]: ['#008000', CompletedOnIcon, CompletedOffIcon],
    [favourite]: ['#ff0000', FavouriteOnIcon, FavouriteOffIcon],
};

const iconSizes = {
    small: '20px',
    default: '24px',
};

export const BookmarkIcon = ({ type, active, color, fontSize = 'default' }) => {
    const [activeColor, OnIcon, OffIcon] = icons[type];
    return (
        <span
            style={{
                display: 'inline-block',
                position: 'relative',
                width: iconSizes[fontSize],
                height: iconSizes[fontSize],
            }}
        >
            {active && (
                <OnIcon
                    fontSize={fontSize}
                    style={{ position: 'absolute', top: 0, left: 0, color: activeColor }}
                />
            )}
            <OffIcon
                fontSize={fontSize}
                style={{ position: 'absolute', top: 0, left: 0, color: active ? '#0001' : color }}
            />
        </span>
    );
};

export default function Bookmarks({ category, id, fontSize = 'small' }) {
    const [storage] = useContext(StorageContext);

    const get = (i) => {
        try {
            const { log } = storage.pageData[category][id][i];
            return log !== undefined && log.length > 0;
        } catch (e) {
            return false;
        }
    };

    return (
        <>
            {storage && storage.available && (get(bookmark) || get(completed) || get(favourite)) && (
                <Box
                    m={0}
                    pt={0.3}
                    pr={0.3}
                    pl={0.3}
                    style={{
                        display: 'inline-block',
                        borderBottomLeftRadius: '5px',
                        backgroundColor: '#FFF',
                    }}
                >
                    {get(bookmark) && <BookmarkIcon active type={bookmark} fontSize={fontSize} />}
                    {get(completed) && <BookmarkIcon active type={completed} fontSize={fontSize} />}
                    {get(favourite) && <BookmarkIcon active type={favourite} fontSize={fontSize} />}
                </Box>
            )}
        </>
    );
}
