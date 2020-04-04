import BookmarkOnIcon from 'mdi-material-ui/Star';
import CompletedOnIcon from 'mdi-material-ui/CheckCircle';
import FavouriteOnIcon from 'mdi-material-ui/Heart';
import Box from '@material-ui/core/Box';
import { StorageContext } from './Storage';

export default ({ dir, id, size = 'small' }) => {
    const bookmark = 'mark';
    const completed = 'done';
    const favourite = 'favt';

    const get = (storage, i) => {
        try {
            return storage.pageData[dir][id][i];
        } catch (e) {
            return false;
        }
    };

    return (
        <StorageContext.Consumer>
            {([storage]) => (
                <>
                    {storage.available && (
                        <Box
                            m={1}
                            p={0}
                            style={{
                                display: 'inline-block',
                                // backgroundColor: '#FFF',
                                borderRadius: '5px',
                            }}
                        >
                            {get(storage, bookmark) && (
                                <BookmarkOnIcon fontSize={size} style={{ color: 'gold' }} />
                            )}
                            {get(storage, completed) && (
                                <CompletedOnIcon fontSize={size} style={{ color: 'green' }} />
                            )}
                            {get(storage, favourite) && (
                                <FavouriteOnIcon fontSize={size} style={{ color: 'red' }} />
                            )}
                        </Box>
                    )}
                </>
            )}
        </StorageContext.Consumer>
    );
};
