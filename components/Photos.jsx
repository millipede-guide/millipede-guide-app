import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';
import photoIndex from '../public/photos/index.json';
import LightboxContext from './LightboxContext';
import { ContentBox } from './Typography';

export default ({ doc }) => (
    <>
        {'photos' in doc && doc.photos.length > 0 && (
            <LightboxContext.Consumer>
                {lightbox => (
                    <ContentBox>
                        <Box mt={2} mb={1}>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                {doc.photos.map(({ src }, index) => (
                                    <Grid item key={src} xs={6} sm={4} md={3}>
                                        <Card>
                                            <CardActionArea
                                                onClick={() =>
                                                    lightbox({
                                                        do: 'show',
                                                        photos: doc.photos,
                                                        index,
                                                    })
                                                }
                                            >
                                                <CardMedia
                                                    style={{
                                                        height: '140px',
                                                    }}
                                                    image={
                                                        src in photoIndex
                                                            ? `/photos/sm/${photoIndex[src].hash}.jpg`
                                                            : null
                                                    }
                                                />
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </ContentBox>
                )}
            </LightboxContext.Consumer>
        )}
    </>
);
