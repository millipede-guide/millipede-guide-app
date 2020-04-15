import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import NextLink from 'next/link';
import humanize from 'underscore.string/humanize';
import Box from '@material-ui/core/Box';
import { useContext, useMemo, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Head from 'next/head';
import Layout from './Layout';
import BookmarkControls from './BookmarkControls';
import Bookmarks from './Bookmarks';
import { StorageContext } from './Storage';
import MarkerMap from './MarkerMap';
import IndexFilterDialog from './IndexFilterDialog';

export default ({ category, geo }) => {
    const flags = ['mark', 'done', 'favt'];
    const [storage, setStorage] = useContext(StorageContext);
    const [dialog, showDialog] = useState(false);

    const geoLocations = useMemo(() => {
        const locations = {};

        geo.features.forEach(feature => {
            const { country, region, park } = feature.properties;
            if (country) {
                if (locations[country] === undefined) locations[country] = {};
                if (region) {
                    if (locations[country][region] === undefined) locations[country][region] = [];
                    if (
                        category !== 'parks' &&
                        park &&
                        locations[country][region].indexOf(park) === -1
                    )
                        locations[country][region].push(park);
                }
            }
        });

        return locations;
    }, [geo]);

    const geoFeatures = useMemo(
        () =>
            geo.features.filter(feature => {
                const prop = feature.properties;

                if (storage.indexFilter !== undefined) {
                    const f = storage.indexFilter;
                    if (f.country) {
                        if (f.country !== prop.country) return false;
                        if (f.region) {
                            if (f.region !== prop.region) return false;
                            if (category !== 'parks' && f.park) {
                                if (f.park !== prop.park) return false;
                            }
                        }
                    }
                }

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
                            current = storage.pageData[category][feature.properties.id][flag].v;
                        } catch (e) {
                            current = false;
                        }
                        return bool && (filter !== true || current === true);
                    }, true);
                }

                return true;
            }),
        [storage, geo],
    );

    const reset = () => {
        setStorage({ action: 'indexFilter', data: {} });
        flags.forEach(k =>
            setStorage({ action: 'pageData', dir: category, id: 'index', key: k, val: false }),
        );
    };

    return (
        <Layout>
            <Head>
                <title>{humanize(category)}</title>
                <meta property="og:site_name" content="The Millipede Guide" />
                <meta property="og:title" content={humanize(category)} />
                <meta property="og:type" content="website" />
            </Head>
            <Box mt={2}>
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
                <Button onClick={() => showDialog(true)}>
                    {(storage.indexFilter &&
                        [
                            storage.indexFilter.park,
                            storage.indexFilter.region,
                            storage.indexFilter.country,
                        ]
                            .filter(Boolean)
                            .join(', ')) ||
                        'All Countries'}
                </Button>
            </Box>
            <IndexFilterDialog
                {...{ dialog, showDialog, category, geoLocations, storage, setStorage }}
            />
            <Box mt={1}>
                <MarkerMap
                    center={
                        geo.features.length > 0
                            ? [...geo.features[0].geometry.coordinates].reverse()
                            : [0, 0]
                    }
                    features={geoFeatures}
                    category={category}
                />
            </Box>
            {geoFeatures.length === 0 && (
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
                    {geoFeatures.map(feature => (
                        <Grid key={feature.properties.id} item xs={6} sm={4} md={3}>
                            <Card>
                                <NextLink
                                    href={`/${category}/[id]`}
                                    as={`/${category}/${feature.properties.id}/`}
                                >
                                    <CardActionArea>
                                        <CardMedia
                                            style={{
                                                height: '140px',
                                                textAlign: 'right',
                                            }}
                                            image={
                                                feature.properties.photo
                                                    ? feature.properties.photo.src
                                                    : null
                                            }
                                        >
                                            <Bookmarks dir={category} id={feature.properties.id} />
                                        </CardMedia>
                                        <CardContent>
                                            <Typography
                                                variant="body2"
                                                component="div"
                                                style={{ margin: 0 }}
                                            >
                                                {feature.properties.region},{' '}
                                                {feature.properties.country}
                                            </Typography>
                                            <Typography
                                                variant="h2"
                                                component="div"
                                                style={{ marginTop: 0 }}
                                            >
                                                {feature.properties.name}
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
