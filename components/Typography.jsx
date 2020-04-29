import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
// see /css/theme.js

const debug = false;
const c = (s) => (debug ? s : undefined);

export const H1 = ({ xs = false, children }) => (
    <Hidden xsDown={!xs}>
        <Box mt={0} mb={0} style={{ backgroundColor: c('#F00') }}>
            <Typography variant="h1">{children}</Typography>
        </Box>
    </Hidden>
);

export const H2 = ({ children }) => (
    <Box mt={4} mb={3} style={{ backgroundColor: c('#F00') }}>
        <Typography variant="h2">{children}</Typography>
    </Box>
);

export const P = ({ children }) => (
    <Box my={1} style={{ backgroundColor: c('#00F') }}>
        <Typography variant="body1">{children}</Typography>
    </Box>
);

export const Small = ({ children }) => (
    <Box style={{ backgroundColor: c('#00F') }}>
        <Typography variant="body2">{children}</Typography>
    </Box>
);

export const ContentBox = ({ children }) => (
    <Box style={{ backgroundColor: c('#0F0') }}>{children}</Box>
);

export const ContentInner = ({ children }) => <Box my={1}>{children}</Box>;
