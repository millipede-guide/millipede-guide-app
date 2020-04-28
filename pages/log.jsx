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
import attractionsIndex from '../public/export/attractions/index.geo.json';
import routesIndex from '../public/export/routes/index.geo.json';
import campsitesIndex from '../public/export/campsites/index.geo.json';
import parksIndex from '../public/export/parks/index.geo.json';
import { StorageContext } from '../components/Storage';
import { ContentBox, H1, P } from '../components/Typography';
import Layout from '../components/Layout';
import { dateStorageFormat, dateDisplayFormat } from '../components/BookmarkControls';

const geoToObj = (geo) =>
    geo.features.reduce(
        (obj, feature) => ({ ...obj, [feature.properties.id]: feature.properties }),
        {},
    );

const index = {
    parks: geoToObj(parksIndex),
    campsites: geoToObj(campsitesIndex),
    routes: geoToObj(routesIndex),
    attractions: geoToObj(attractionsIndex),
};

const LogItem = ({ date, category, id, favt }) => {
    const { name, photo, park, region, country } = index[category][id]
        ? index[category][id]
        : {
              name: id.split('~').reverse().join(' '),
              photo: {},
              park: '',
              region: '',
              country: '',
          };

    return (
        <>
            <NextLink href={`/${category}/[id]`} as={`/${category}/${id}`}>
                <ListItem alignItems="flex-start" button disableGutters>
                    <ListItemAvatar>
                        <Badge
                            badgeContent={
                                favt && (
                                    <FavouriteIcon style={{ fontSize: '16px', color: '#F00' }} />
                                )
                            }
                        >
                            <Avatar src={photo.src} variant="rounded" />
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
                                        {name}
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
            Object.keys(index).forEach((category) => {
                Object.keys(storage.pageData[category]).forEach((id) => {
                    if (id !== 'index' && id in index[category]) {
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
