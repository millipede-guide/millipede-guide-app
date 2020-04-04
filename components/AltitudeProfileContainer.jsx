import Box from '@material-ui/core/Box';
import { ContentBox } from './Typography';

export default () => (
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
        </Box>
    </ContentBox>
);
