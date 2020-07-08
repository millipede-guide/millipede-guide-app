import { useContext, useState, useEffect } from 'react';
import Moment from 'moment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import FavouriteIcon from 'mdi-material-ui/Heart';
import Grid from '@material-ui/core/Grid';
import NextLink from 'next/link';
import _get from 'lodash/get';
import CategoryIcon from '../components/CategoryIcon';
import { StorageContext } from '../components/Storage';
import { ContentBox, H1, P } from '../components/Typography';
import Layout from '../components/Layout';
import { dateStorageFormat, dateDisplayFormat } from '../components/BookmarkControls';
import photoIndex from '../public/photos/index.json';

const LogItem = ({ date, category, id, favt }) => {
    const [storage] = useContext(StorageContext);
    const { name, park, region, country, photo } = _get(storage, ['pageCache', category, id], {});

    return (
        <>
            <NextLink href="/[category]/[...id]" as={`/${category}/${id}`}>
                <ListItem alignItems="flex-start" button disableGutters>
                    <ListItemAvatar>
                        <Badge
                            badgeContent={
                                favt && (
                                    <FavouriteIcon style={{ fontSize: '16px', color: '#F00' }} />
                                )
                            }
                        >
                            <Avatar
                                src={
                                    photo &&
                                    photo.src &&
                                    photoIndex[photo.src] &&
                                    photoIndex[photo.src].hash &&
                                    `${process.env.assetPrefix}/photos/sm/${
                                        photoIndex[photo.src].hash
                                    }.jpg`
                                }
                                variant="rounded"
                            >
                                <CategoryIcon category={category} />
                            </Avatar>
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText
                        disableTypography
                        primary={
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="flex-start"
                                spacing={1}
                            >
                                <Grid item xs={12} sm>
                                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                                        {name || id}
                                    </Typography>
                                    <Typography variant="body2">
                                        {park && `${park}, `}
                                        {region}
                                        {', '}
                                        {country}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        <span className="mdi mdi-calendar" />{' '}
                                        {Moment(date, dateStorageFormat).format(dateDisplayFormat)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        }
                    />
                </ListItem>
            </NextLink>
            <Divider variant="inset" />
        </>
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
                        const { favt } = storage.pageData[category][id];
                        if (done && done.log !== undefined && done.log.length > 0) {
                            done.log.forEach((date) => {
                                data.push({
                                    date,
                                    category,
                                    id,
                                    favt: favt && favt.log !== undefined && favt.log.length > 0,
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
            <ContentBox>
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
                        {logData !== null && logData.length !== 0 && (
                            <List>
                                {logData.map((item) => (
                                    <LogItem key={item.id + item.date} {...item} />
                                ))}
                            </List>
                        )}
                    </>
                )}
            </ContentBox>
        </Layout>
    );
};
