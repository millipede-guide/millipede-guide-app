import { useContext, useState, useEffect } from 'react';
import Moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import _get from 'lodash/get';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';
import { StorageContext } from '../components/Storage';
import { H1, P } from '../components/Typography';
import Layout from '../components/Layout';
import Link from '../components/Link';
import { dateStorageFormat, dateDisplayFormat } from '../components/BookmarkControls';
import photoIndex from '../public/photos/index.json';
import Bookmarks from '../components/Bookmarks';

const LogItem = ({ date, category, id }) => {
    const [storage] = useContext(StorageContext);
    const { name, park, region, country, photo } = _get(storage, ['pageCache', category, id], {});

    return (
        <Link href="/[category]/[...id]" as={`/${category}/${id}`}>
            <Card>
                <CardActionArea>
                    <CardMedia
                        style={{
                            height: '140px',
                            textAlign: 'right',
                        }}
                        image={
                            photo &&
                            photo.src &&
                            photoIndex[photo.src] &&
                            photoIndex[photo.src].hash &&
                            `${process.env.assetPrefix}/photos/sm/${photoIndex[photo.src].hash}.jpg`
                        }
                    >
                        <Bookmarks category={category} id={id} />
                    </CardMedia>
                    <CardContent>
                        <Typography variant="body2" component="div" style={{ margin: 0 }}>
                            <span className="mdi mdi-calendar" />{' '}
                            {Moment(date, dateStorageFormat).format(dateDisplayFormat)}
                        </Typography>
                        <Typography variant="body2" component="div" style={{ margin: 0 }}>
                            {park && `${park}, `}
                            {region}
                            {', '}
                            {country}
                        </Typography>
                        <Typography variant="h2" component="div" style={{ marginTop: 0 }}>
                            {name || id}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

export default () => {
    const [storage] = useContext(StorageContext);
    const [logData, setLogData] = useState([]);

    useEffect(() => {
        if (storage.available && !storage.error && storage.pageData) {
            const data = [];
            ['parks', 'routes', 'attractions', 'campsites'].forEach((category) => {
                Object.keys(storage.pageData[category] || {}).forEach((id) => {
                    if (id !== 'index') {
                        const { done } = storage.pageData[category][id];
                        if (done && done.log !== undefined && done.log.length > 0) {
                            done.log.forEach((date) => {
                                data.push({
                                    date,
                                    category,
                                    id,
                                });
                            });
                        }
                    }
                });
            });
            data.sort(
                (a, b) => Moment(b.date, dateStorageFormat) - Moment(a.date, dateStorageFormat),
            );
            setLogData(data);
        }
    }, [storage]);

    return (
        <Layout title="Log" href="/log/">
            <H1>Log</H1>
            <Box mt={3}>
                {(!storage || !storage.available) && 'Loading...'}
                {storage && storage.available && (
                    <>
                        {logData === null ||
                            (logData.length === 0 && (
                                <P>
                                    Use the check button near the top of parks, campsites, routes
                                    and attractions pages to log your adventures!
                                </P>
                            ))}
                        {logData !== null && logData.length > 0 && (
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                {logData.map((item) => (
                                    <Grid item key={item.id + item.date} xs={6} sm={4} md={3}>
                                        <LogItem {...item} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}
            </Box>
        </Layout>
    );
};
