import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import NextLink from 'next/link';
import humanize from 'underscore.string/humanize';
import Box from '@material-ui/core/Box';
import { useContext, useMemo } from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Head from 'next/head';
import Layout from './Layout';
import photoIndex from '../public/photos/index.json';
import LeafletMap from './LeafletMap';
import BookmarkControls from './BookmarkControls';
import Bookmarks from './Bookmarks';
import { StorageContext } from './Storage';
import sitePhotos from '../utils/sitePhotos.json';

export default ({ category, index }) => {
    const [storage, setStorage] = useContext(StorageContext);

    const flags = ['mark', 'done', 'favt'];

    const indexFiltered = useMemo(
        () =>
            index.filter(item => {
                if (
                    storage &&
                    storage.pageData &&
                    storage.pageData[category] &&
                    storage.pageData[category].index
                ) {
                    return flags.reduce((bool, flag) => {
                        let filter;
                        let current;
                        try {
                            filter = storage.pageData[category].index[flag].v;
                        } catch (e) {
                            filter = false;
                        }
                        try {
                            current = storage.pageData[category][item.id][flag].v;
                        } catch (e) {
                            current = false;
                        }
                        return bool && (filter !== true || current === true);
                    }, true);
                }
                return true;
            }),
        [storage, index],
    );

    const reset = () => {
        flags.forEach(k =>
            setStorage({ type: 'pageData', dir: category, id: 'index', key: k, val: false }),
        );
    };

    return (
        <Layout>
            <Head>
                <title>{humanize(category)}</title>
                <meta property="og:site_name" content="The Millipede Guide" />
                <meta property="og:title" content={humanize(category)} />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content={`/photos/sm/${photoIndex[sitePhotos[category].src].hash}.jpg`}
                />
            </Head>
            <Box mt={3} mb={2}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item>
                        <Typography variant="h1">{humanize(category)}</Typography>
                    </Grid>
                    <Grid item>
                        <BookmarkControls dir={category} id="index" />
                    </Grid>
                </Grid>
            </Box>
            <Box mt={1}>
                <LeafletMap
                    center={index.length > 0 ? index[0].location : [0, 0]}
                    markers={indexFiltered}
                    category={category}
                />
            </Box>
            {indexFiltered.length === 0 && (
                <Box mt={3}>
                    <Alert
                        elevation={0}
                        severity="warning"
                        variant="filled"
                        action={
                            <Button onClick={reset} style={{ color: '#FFF' }}>
                                Reset
                            </Button>
                        }
                    >
                        No results for current filter.
                    </Alert>
                </Box>
            )}
            <Box mt={3}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                >
                    {indexFiltered.map(item => (
                        <Grid key={item.id} item xs={6} sm={6} md={3}>
                            <Card>
                                <NextLink
                                    href={`/${category}/[id]`}
                                    as={`/${category}/${item.id}/`}
                                >
                                    <CardActionArea>
                                        <CardMedia
                                            style={{
                                                height: '140px',
                                                textAlign: 'right',
                                            }}
                                            image={
                                                item.photos.length > 0 &&
                                                item.photos[0].src in photoIndex
                                                    ? `/photos/sm/${
                                                          photoIndex[item.photos[0].src].hash
                                                      }.jpg`
                                                    : null
                                            }
                                        >
                                            <Bookmarks dir={category} id={item.id} />
                                        </CardMedia>
                                        <CardContent>
                                            <Typography
                                                variant="body2"
                                                component="div"
                                                style={{ margin: 0 }}
                                            >
                                                {item.region}, {item.country}
                                            </Typography>
                                            <Typography
                                                variant="h2"
                                                component="div"
                                                style={{ marginTop: 0 }}
                                            >
                                                {item.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </NextLink>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Layout>
    );
};
