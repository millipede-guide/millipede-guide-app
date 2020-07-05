import Grid from '@material-ui/core/Grid';
import humanize from 'underscore.string/humanize';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GoogleMapsIcon from 'mdi-material-ui/GoogleMaps';
import AppleIcon from 'mdi-material-ui/Apple';
import NoImageIcon from 'mdi-material-ui/ImageOffOutline';
import PrimaryIcon from 'mdi-material-ui/Star';
import MultipleImageIcon from 'mdi-material-ui/ImageMultipleOutline';
import CardActionArea from '@material-ui/core/CardActionArea';
import MapIcon from 'mdi-material-ui/Map';
import { H2, ContentBox, ContentInner } from './Typography';
import photoIndex from '../public/photos/index.json';
import LightboxContext from './LightboxContext';

// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
function lon2tile(lon, zoom) {
    return Math.floor(((lon + 180) / 360) * 2 ** zoom);
}
function lat2tile(lat, zoom) {
    return Math.floor(
        ((1 -
            Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
                Math.PI) /
            2) *
            2 ** zoom,
    );
}

const filter = (i) =>
    i.show !== false && typeof i.photos === 'object' && i.photos.length && i.photos.length > 0;

export default ({ heading, items }) => (
    <>
        {items !== undefined && items.filter(filter).length > 0 && (
            <LightboxContext.Consumer>
                {(lightbox) => (
                    <ContentBox>
                        <H2>{heading}</H2>
                        <ContentInner>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={2}
                                m={1}
                            >
                                {items.filter(filter).map((item) => (
                                    <Grid
                                        item
                                        xs={6}
                                        sm={3}
                                        key={JSON.stringify(item.location || item.osm || item.name)}
                                    >
                                        <Card>
                                            <CardActionArea
                                                disabled={
                                                    item.photos === undefined ||
                                                    item.photos.length === 0
                                                }
                                                onClick={() =>
                                                    lightbox({
                                                        do: 'show',
                                                        photos: item.photos,
                                                    })
                                                }
                                            >
                                                <CardMedia
                                                    style={{
                                                        height: '100px',
                                                        backgroundColor: '#EEE',
                                                    }}
                                                    image={
                                                        item.photos === undefined ||
                                                        item.photos.length === 0
                                                            ? `https://tile.millipede-guide.com/19/${lon2tile(
                                                                  item.location[1],
                                                                  19,
                                                              )}/${lat2tile(
                                                                  item.location[0],
                                                                  19,
                                                              )}.png`
                                                            : `/photos/sm/${
                                                                  photoIndex[item.photos[0].src]
                                                                      .hash
                                                              }.jpg`
                                                    }
                                                >
                                                    {item.primary && (
                                                        <PrimaryIcon
                                                            style={{
                                                                color: '#0005',
                                                                position: 'absolute',
                                                                top: '5px',
                                                                left: '5px',
                                                            }}
                                                        />
                                                    )}
                                                    {(item.photos === undefined ||
                                                        item.photos.length === 0) && (
                                                        <NoImageIcon
                                                            style={{
                                                                color: '#0005',
                                                                position: 'absolute',
                                                                top: '5px',
                                                                right: '5px',
                                                            }}
                                                        />
                                                    )}
                                                    {item.photos !== undefined &&
                                                        item.photos.length > 1 && (
                                                            <MultipleImageIcon
                                                                style={{
                                                                    color: '#0005',
                                                                    position: 'absolute',
                                                                    top: '5px',
                                                                    right: '5px',
                                                                }}
                                                            />
                                                        )}
                                                </CardMedia>
                                            </CardActionArea>
                                            <CardContent>
                                                {'name' in item && (
                                                    <strong>{humanize(item.name)}</strong>
                                                )}
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    component="div"
                                                >
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            listStyleType: 'none',
                                                        }}
                                                    >
                                                        {item.tags &&
                                                            Object.keys(item.tags).map((k) => (
                                                                <li key={k}>
                                                                    <strong>{humanize(k)}:</strong>{' '}
                                                                    {typeof item.tags[k] ===
                                                                        'boolean' &&
                                                                        (item.tags[k]
                                                                            ? 'Yes'
                                                                            : 'No')}
                                                                    {typeof item.tags[k] ===
                                                                        'string' &&
                                                                        item.tags[k]
                                                                            .split(';')
                                                                            .map((i) => humanize(i))
                                                                            .join(', ')}
                                                                    {typeof item.tags[k] ===
                                                                        'object' &&
                                                                        'length' in item[k] &&
                                                                        item.tags[k].length}
                                                                    <br />
                                                                </li>
                                                            ))}
                                                    </ul>
                                                    {item.photos !== undefined &&
                                                        item.photos.length > 1 && (
                                                            <span>{item.photos.length} photos</span>
                                                        )}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    href={`https://www.openstreetmap.org/${
                                                        item.osm
                                                            ? Object.keys(item.osm).map(
                                                                  (i) => `${i}/${item.osm[i]}`,
                                                              )[0]
                                                            : `#map=19/${item.location[0]}/${item.location[1]}`
                                                    }`}
                                                >
                                                    <MapIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${item.location[0]},${item.location[1]}`}
                                                >
                                                    <GoogleMapsIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    href={`http://maps.apple.com/?daddr=${item.location[0]},${item.location[1]}`}
                                                >
                                                    <AppleIcon />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </ContentInner>
                    </ContentBox>
                )}
            </LightboxContext.Consumer>
        )}
    </>
);
