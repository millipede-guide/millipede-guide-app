import Grid from '@material-ui/core/Grid';
import LocationCard from './LocationCard';
import { ContentInner } from './Typography';

export default ({ items, keys }) => (
    <ContentInner>
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            spacing={2}
            m={1}
        >
            {items.map(item => (
                <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    key={'name' in item ? item.name : JSON.stringify(item)}
                >
                    <LocationCard item={item} keys={keys} />
                </Grid>
            ))}
        </Grid>
    </ContentInner>
);
