import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import NextLink from 'next/link';
import humanize from 'underscore.string/humanize';
import Box from '@material-ui/core/Box';
import { useContext, useMemo, useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import FilterOptionsActiveIcon from 'mdi-material-ui/TextBoxCheck';
import FilterOptionsInactiveIcon from 'mdi-material-ui/TextBoxCheckOutline';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Layout from './Layout';
import BookmarkControls from './BookmarkControls';
import Bookmarks from './Bookmarks';
import { StorageContext } from './Storage';
import MarkerMap from './MarkerMap';
import LocationFilterDialog from './LocationFilterDialog';
import BooleanFilterDialog from './BooleanFilterDialog';
import { H1 } from './Typography';
import photosIndex from '../public/photos/index.json';

export default ({ category, geo }) => {
    const flags = ['mark', 'done', 'favt'];

    const [storage] = useContext(StorageContext);
    const [geoFeatures, setGeoFeatures] = useState((geo && geo.features) || []);
    const [showLocationFilterDialog, setLocationFilterDialog] = useState(false);
    const [showBooleanFilterDialog, setBooleanFilterDialog] = useState(false);

    useEffect(
        () =>
            setGeoFeatures(
                geo.features.filter((feature) => {
                    const props = feature.properties;

                    if (storage.indexLocationFilter !== undefined) {
                        const f = storage.indexLocationFilter;
                        if (f.country) {
                            if (f.country !== props.country) return false;
                            if (f.region) {
                                if (f.region !== props.region) return false;
                                if (category !== 'parks' && f.park) {
                                    if (f.park !== props.park) return false;
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
                        if (
                            !flags.reduce((bool, flag) => {
                                let filter;
                                let current;
                                try {
                                    filter =
                                        storage.pageData[category].index[flag].log &&
                                        storage.pageData[category].index[flag].log.length > 0;
                                } catch (e) {
                                    filter = false;
                                }
                                try {
                                    current =
                                        storage.pageData[category][props.id][flag].log &&
                                        storage.pageData[category][props.id][flag].log.length > 0;
                                } catch (e) {
                                    current = false;
                                }
                                return bool && (filter !== true || current === true);
                            }, true)
                        )
                            return false;
                    }

                    if (storage.indexBooleanFilter && storage.indexBooleanFilter[category]) {
                        const boolfilter = storage.indexBooleanFilter[category];
                        return Object.keys(boolfilter).reduce((b1, sup) => {
                            if (b1) {
                                return Object.keys(boolfilter[sup]).reduce((b2, sub) => {
                                    if (b2 && boolfilter[sup][sub] !== null) {
                                        return (
                                            props[sup] !== null &&
                                                props[sup] !== undefined &&
                                                props[sup][sub] === boolfilter[sup][sub]
                                        );
                                    }
                                    return b2;
                                }, b1);
                            }
                            return b1;
                        }, true);
                    }

                    return true;
                }),
            ),
        [storage, geo],
    );

    const boolFilterCount = useMemo(() => {
        if (storage.indexBooleanFilter && storage.indexBooleanFilter[category]) {
            return Object.values(storage.indexBooleanFilter[category]).reduce(
                (count, obj) => count + Object.values(obj).filter((i) => i !== null).length,
                0,
            );
        }
        return 0;
    }, [storage]);

    return (
        <Layout title={humanize(category)} href={`/${category}`}>
            <H1>{humanize(category)}</H1>
            <Box mt={1}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setLocationFilterDialog(true)}
                        >
                            {(storage.indexLocationFilter &&
                              [
                                  storage.indexLocationFilter.park,
                                  storage.indexLocationFilter.region,
                                  storage.indexLocationFilter.country,
                              ]
                              .filter(Boolean)
                              .join(', ')) ||
                             'All Countries'}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Badge
                            badgeContent={boolFilterCount}
                            showZero={false}
                            overlap="circle"
                            color="error"
                        >
                            <IconButton
                                color="primary"
                                onClick={() => setBooleanFilterDialog(true)}
                            >
                                {boolFilterCount === 0 ? (
                                    <FilterOptionsInactiveIcon />
                                ) : (
                                    <FilterOptionsActiveIcon />
                                )}
                            </IconButton>
                        </Badge>
                        <BookmarkControls category={category} id="index" />
                    </Grid>
                </Grid>
            </Box>
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
                    <Alert elevation={0} severity="warning" variant="outlined">
                        No results for selected filters.
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
                    {geoFeatures.map((feature) => (
                        <Grid key={feature.properties.id} item xs={6} sm={4} md={3}>
                            <NextLink href="/[category]/[...id]" as={feature.properties.href}>
                                <a style={{ textDecoration: 'none' }}>
                                    <Card>
                                        <CardActionArea>
                                            <CardMedia
                                                style={{
                                                    height: '140px',
                                                    textAlign: 'right',
                                                }}
                                                image={
                                                    feature.properties.photo
                                                        ? `/photos/sm/${
                                                              photosIndex[
                                                                  feature.properties.photo.src
                                                              ].hash
                                                          }.jpg`
                                                        : null
                                                }
                                            >
                                                <Bookmarks
                                                    category={category}
                                                    id={feature.properties.id}
                                                />
                                            </CardMedia>
                                            <CardContent>
                                                <Typography
                                                    variant="body2"
                                                    component="div"
                                                    style={{ margin: 0 }}
                                                >
                                                    {[
                                                        storage.indexLocationFilter &&
                                                            storage.indexLocationFilter.park
                                                            ? null
                                                            : feature.properties.park,
                                                        storage.indexLocationFilter &&
                                                            storage.indexLocationFilter.region
                                                            ? null
                                                            : feature.properties.region,
                                                        storage.indexLocationFilter &&
                                                            storage.indexLocationFilter.country
                                                            ? null
                                                            : feature.properties.country,
                                                    ]
                                                     .filter(Boolean)
                                                     .join(', ')}
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
                                    </Card>
                                </a>
                            </NextLink>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <LocationFilterDialog
                {...{
                    open: showLocationFilterDialog,
                    setOpen: setLocationFilterDialog,
                    category,
                    geo,
                }}
            />
            <BooleanFilterDialog
                {...{
                    open: showBooleanFilterDialog,
                    setOpen: setBooleanFilterDialog,
                    category,
                    geo,
                }}
            />
        </Layout>
    );
};
