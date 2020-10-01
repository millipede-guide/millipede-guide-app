import Box from '@material-ui/core/Box';
import DistanceIcon from 'mdi-material-ui/ArrowCollapseRight';
import GainIcon from 'mdi-material-ui/ArrowUp';
import LossIcon from 'mdi-material-ui/ArrowDown';
import AscendingIcon from 'mdi-material-ui/ArrowTopRight';
import DescendingIcon from 'mdi-material-ui/ArrowBottomRight';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import { ContentBox } from './Typography';

export default function AltitudeProfileContainer({ stats }) {
    return (
        <ContentBox>
            <Box mt={2}>
                <div
                    style={{
                        position: 'relative',
                        height: '140px',
                        maxHeight: '20vh',
                    }}
                >
                    <canvas id="altitudeProfile" />
                </div>
                <Grid
                    container
                    wrap="nowrap"
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Button disabled startIcon={<GainIcon />} style={{ color: '#777' }}>
                            {(stats && stats.gain) || '-'}
                        </Button>
                        <Button disabled startIcon={<LossIcon />} style={{ color: '#777' }}>
                            {(stats && stats.loss) || '-'}
                        </Button>
                    </Grid>
                    <Hidden xsDown>
                        <Grid item>
                            <Button
                                disabled
                                startIcon={<AscendingIcon />}
                                style={{ color: '#777' }}
                            >
                                {(stats && stats.asc) || '-'}
                            </Button>
                            <Button
                                disabled
                                startIcon={<DescendingIcon />}
                                style={{ color: '#777' }}
                            >
                                {(stats && stats.desc) || '-'}
                            </Button>
                        </Grid>
                    </Hidden>
                    <Grid item>
                        <Button disabled endIcon={<DistanceIcon />} style={{ color: '#777' }}>
                            {(stats && stats.dist) || '-'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </ContentBox>
    );
}
