import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MuiLink from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import humanize from 'underscore.string/humanize';
import Button from '@material-ui/core/Button';
import AboutIcon from 'mdi-material-ui/Information';
import LogIcon from 'mdi-material-ui/CheckCircle';
import PrivacyIcon from 'mdi-material-ui/Eye';
import ExportIcon from 'mdi-material-ui/FileDownload';
import Link from '../components/Link';
import Layout from '../components/Layout';
import { ContentBox, H1, Small } from '../components/Typography';
import photoIndex from '../public/photos/index.json';
import sitePhotos from '../utils/sitePhotos.json';
import omap from '../utils/omap';

export default function Index() {
    return (
        <Layout>
            <H1>The Millipede Guide</H1>
            <ContentBox>
                <Box mt={3}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        spacing={2}
                    >
                        {omap(sitePhotos).map(([category, { src }]) => (
                            <Grid key={category} item xs={6} sm={6} md={3}>
                                <Link href="/[category]" as={`/${category}`}>
                                    <Card>
                                        <CardActionArea>
                                            <CardMedia
                                                style={{
                                                    height: '140px',
                                                }}
                                                image={`${process.env.assetPrefix}/photos/sm/${photoIndex[src].hash}.jpg`}
                                            />
                                            <CardContent>
                                                <Typography variant="h2" component="span">
                                                    {humanize(category)}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box mt={4} mb={2}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item>
                            <Button
                                component={Link}
                                href="/log"
                                as="/log"
                                color="primary"
                                startIcon={<LogIcon />}
                            >
                                Log
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                component={Link}
                                href="/export"
                                as="/export"
                                color="primary"
                                startIcon={<ExportIcon />}
                            >
                                Export
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                component={Link}
                                href="/about"
                                as="/about"
                                color="primary"
                                startIcon={<AboutIcon />}
                            >
                                About
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                component={Link}
                                href="/privacy"
                                as="/privacy"
                                color="primary"
                                startIcon={<PrivacyIcon />}
                            >
                                Privacy
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Small>
                    Photos:{' '}
                    {omap(sitePhotos).map(([category, { attr, license, href }]) => (
                        <MuiLink key={category} href={href}>
                            {humanize(category)} is by {attr} [{license}]
                            {category === 'attractions' ? '. ' : ', '}
                        </MuiLink>
                    ))}
                </Small>
            </ContentBox>
        </Layout>
    );
}
