import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import GoogleMapsIcon from 'mdi-material-ui/GoogleMaps';
import AppleIcon from 'mdi-material-ui/Apple';
import MapIcon from 'mdi-material-ui/Map';
import Box from '@material-ui/core/Box';
import BookmarkControls from './BookmarkControls';

export default ({ category, id, doc }) => (
    <Box>
        <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item>
                <BookmarkControls category={category} id={id} doc={doc} userUpdate />
            </Grid>
            <Grid item>
                <IconButton
                    color="primary"
                    href={`https://www.openstreetmap.org/#map=18/${doc.location[0]}/${doc.location[1]}`}
                >
                    <MapIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${doc.location[0]},${doc.location[1]}`}
                >
                    <GoogleMapsIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    href={`http://maps.apple.com/?daddr=${doc.location[0]},${doc.location[1]}`}
                >
                    <AppleIcon />
                </IconButton>
            </Grid>
        </Grid>
    </Box>
);
