import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import photoIndex from '../public/photos/index.json';
import Layout from '../components/Layout';
import { H1 } from '../components/Typography';

export default () => (
    <Layout>
        <H1>Photos</H1>
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={2}>
            {Object.values(photoIndex).map(({ cache }) => (
                <Grid item key={cache} xs={6} sm={4} md={3}>
                    <Card>
                        <CardMedia
                            style={{
                                height: '140px',
                            }}
                            image={`/photos/sm/${cache}`}
                        />
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Layout>
);
