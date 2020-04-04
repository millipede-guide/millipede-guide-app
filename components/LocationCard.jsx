import humanize from 'underscore.string/humanize';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GoogleMapsIcon from 'mdi-material-ui/GoogleMaps';
import AppleIcon from 'mdi-material-ui/Apple';
import CardActionArea from '@material-ui/core/CardActionArea';
import MapIcon from 'mdi-material-ui/Map';
import photoIndex from '../public/photos/index.json';
import LightboxContext from './LightboxContext';

export default ({ item, keys }) => (
    <LightboxContext.Consumer>
        {lightbox => (
            <Card>
                {item.photos && item.photos.length > 0 && (
                    <CardActionArea
                        onClick={() =>
                            lightbox({
                                do: 'show',
                                photos: item.photos,
                            })
                        }
                    >
                        <CardMedia
                            style={{
                                height: '140px',
                            }}
                            image={`/photos/sm/${photoIndex[item.photos[0].src].cache}`}
                        />
                    </CardActionArea>
                )}
                <CardContent>
                    {'name' in item && <strong>{item.name}</strong>}
                    <Typography variant="body2" color="textSecondary" component="div">
                        <ul
                            style={{
                                margin: 0,
                                padding: 0,
                                listStyleType: 'none',
                            }}
                        >
                            {keys
                                .filter(k => k in item)
                                .map(k => (
                                    <li key={k}>
                                        <strong>{humanize(k)}:</strong>{' '}
                                        {typeof item[k] === 'boolean'
                                            ? (item[k] && 'Yes') || 'No'
                                            : humanize(item[k])}
                                        <br />
                                    </li>
                                ))}
                        </ul>
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton
                        color="primary"
                        href={`https://www.openstreetmap.org/#map=18/${item.location[0]}/${item.location[1]}`}
                    >
                        <MapIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        href={`https://www.google.com/maps/dir/?api=1&destination=${item.location[0]},${item.location[1]}`}
                    >
                        <GoogleMapsIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        href={`http://maps.apple.com/?daddr=${item.location[0]},${item.location[1]}`}
                    >
                        <AppleIcon />
                    </IconButton>
                </CardActions>
            </Card>
        )}
    </LightboxContext.Consumer>
);
