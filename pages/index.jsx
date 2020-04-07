import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MuiLink from '@material-ui/core/Link';
import NextLink from 'next/link';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import humanize from 'underscore.string/humanize';
import Layout from '../components/Layout';
import { H1, H2, Small } from '../components/Typography';
import photoIndex from '../public/photos/index.json';
import sitePhotos from '../utils/sitePhotos.json';
import omap from '../utils/omap';

export default function Index() {
    return (
        <Layout>
            <Head>
                <title>The Millipede Guide</title>
            </Head>
            <H1>The Millipede Guide</H1>
            <Box mt={3} mb={1}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                >
                    {omap(sitePhotos).map(([category, { src }]) => (
                        <Grid key={category} item xs={6} sm={6} md={3}>
                            <NextLink href={`/${category}/all`}>
                                <Card>
                                    <CardActionArea>
                                        <CardMedia
                                            style={{
                                                height: '140px',
                                            }}
                                            image={`/photos/sm/${photoIndex[src].hash}.jpg`}
                                        />
                                        <CardContent>
                                            <Typography variant="h2" component="span">
                                                {humanize(category)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </NextLink>
                        </Grid>
                    ))}
                </Grid>
                <br />
                <small>
                    <H2>Attribution</H2>
                    {omap(sitePhotos).map(([category, { attr, license, href }]) => (
                        <Small key={category}>
                            <MuiLink href={href}>
                                {humanize(category)} photo is by {attr} [{license}]
                            </MuiLink>
                        </Small>
                    ))}
                </small>
            </Box>
        </Layout>
    );
}
