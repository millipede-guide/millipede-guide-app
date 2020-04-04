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
import Layout from '../components/Layout';
import { H1, H2, Small } from '../components/Typography';

export default function Index() {
    const links = [
        {
            card: 'Parks',
            href: 'parks',
            image: 'https://live.staticflickr.com/65535/48834525112_d1e4807566_b.jpg',
            license: 'CC BY-ND 2.0',
            attr: 'Amitinder Cheema',
            src: 'https://www.flickr.com/photos/163236208@N08/48834525112',
        },
        {
            card: 'Campsites',
            href: 'campsites',
            image: 'https://live.staticflickr.com/4770/24937209447_534080ac2c_b.jpg',
            license: 'CC BY-NC-SA 2.0',
            attr: 'subaguso',
            src: 'https://www.flickr.com/photos/162284319@N03/24937209447',
        },
        {
            card: 'Routes',
            href: 'routes',
            image: 'https://live.staticflickr.com/7048/6900662391_540daa3667_b.jpg',
            license: 'CC BY 2.0',
            attr: 'Garden State Hiker',
            src: 'https://www.flickr.com/photos/42693172@N05/6900662391',
        },
        {
            card: 'Attractions',
            href: 'attractions',
            image: 'https://farm4.staticflickr.com/3934/14917023204_4901668606_b.jpg',
            license: 'CC BY 2.0',
            attr: 'Kiwi Tom',
            src: 'https://www.flickr.com/photos/127665714@N08/14917023204',
        },
    ];

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
                    {links.map(({ card, href, image }) => (
                        <Grid key={href} item xs={6} sm={6} md={3}>
                            <NextLink href={`/${href}/all`}>
                                <Card>
                                    <CardActionArea>
                                        <CardMedia
                                            style={{
                                                height: '140px',
                                            }}
                                            image={image}
                                        />
                                        <CardContent>
                                            <Typography variant="h2" component="span">
                                                {card}
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
                    <H2>Image Attribution</H2>
                    {links.map(({ card, license, attr, src }) => (
                        <Small key={src}>
                            <MuiLink href={src}>
                                {card} is by {attr} [{license}]
                            </MuiLink>
                        </Small>
                    ))}
                </small>
            </Box>
        </Layout>
    );
}
