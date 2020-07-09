import Grid from '@material-ui/core/Grid';
import humanize from 'underscore.string/humanize';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Head from 'next/head';
import { StorageContext } from './Storage';
import LightboxContainer from './LightboxContainer';
import Layout from './Layout';
import MapToolbar from './MapToolbar';
import GeoJsonMap from './GeoJsonMap';
import Photos from './Photos';
import Attribution from './Attribution';
import WebsiteLinks from './WebsiteLinks';
import Features from './Features';
import Infrastructure from './Infrastructure';
import Export from './Export';
import OpenSource from './OpenSource';
import { H1 } from './Typography';
import Link from './Link';
import photoIndex from '../public/photos/index.json';
import getFeaturePhoto from '../utils/getFeaturePhoto';

export default ({ category, id, doc, fileName }) => {
    const featurePhoto =
        (doc.photos && doc.photos.length > 0 && getFeaturePhoto(doc.photos)) || null;

    return (
        <>
            <Head>
                <meta
                    property="og:description"
                    content={['park' in doc ? doc.park : null, doc.region, doc.country]
                        .filter(Boolean)
                        .join(', ')}
                />
                {featurePhoto && featurePhoto.src && photoIndex[featurePhoto.src] && photoIndex[featurePhoto.src].hash && (
                    <meta
                        property="og:image"
                        content={`${process.env.assetPrefix}/photos/sm/${
                            photoIndex[featurePhoto.src].hash
                        }.jpg`}
                    />
                )}
            </Head>
            <LightboxContainer>
                <Layout
                    title={humanize(category)}
                    windowTitle={doc.name}
                    href="/[component]"
                    as={`/${category}`}
                >
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        spacing={1}
                        wrap="wrap-reverse"
                    >
                        <Grid item>
                            <H1 xs>{doc.name}</H1>
                        </Grid>
                        <Grid item>
                            <StorageContext.Consumer>
                                {([, setStorage]) => (
                                    <Breadcrumbs separator="&rsaquo;">
                                        {doc.park && (
                                            <Link
                                                href="/[category]"
                                                as={`/${category}`}
                                                onClick={() =>
                                                    setStorage({
                                                        action: 'indexLocationFilter',
                                                        data: {
                                                            country: doc.country,
                                                            region: doc.region,
                                                            park: doc.park,
                                                        },
                                                    })
                                                }
                                            >
                                                {doc.park}
                                            </Link>
                                        )}
                                        <Link
                                            href="/[category]"
                                            as={`/${category}`}
                                            onClick={() =>
                                                setStorage({
                                                    action: 'indexLocationFilter',
                                                    data: {
                                                        country: doc.country,
                                                        region: doc.region,
                                                        park: '',
                                                    },
                                                })
                                            }
                                        >
                                            {doc.region}
                                        </Link>
                                        <Link
                                            href="/[category]"
                                            as={`/${category}`}
                                            onClick={() =>
                                                setStorage({
                                                    action: 'indexLocationFilter',
                                                    data: {
                                                        country: doc.country,
                                                        region: '',
                                                        park: '',
                                                    },
                                                })
                                            }
                                        >
                                            {doc.country}
                                        </Link>
                                    </Breadcrumbs>
                                )}
                            </StorageContext.Consumer>
                        </Grid>
                    </Grid>
                    <MapToolbar category={category} id={id} doc={doc} />
                    <GeoJsonMap
                        doc={doc}
                        center={doc.location}
                        category={category}
                        fileName={fileName}
                        showAltitudeProfile={category === 'routes'}
                    />
                    <Photos doc={doc} />
                    <Features heading="Features" features={doc.features} />
                    <Features heading="Allowances and Restrictions" features={doc.restrictions} />
                    <Features heading="Accessibility" features={doc.accessibility} />
                    <Features heading="Getting There" features={doc.getting_there} />
                    {doc.infrastructure &&
                        ['transport', 'parking', 'toilets', 'water', 'shelter', 'information']
                            .filter((k) => doc.infrastructure[k])
                            .map((k) => (
                                <Infrastructure
                                    key={k}
                                    heading={humanize(k)}
                                    items={doc.infrastructure[k] || []}
                                />
                            ))}
                    <WebsiteLinks doc={doc} />
                    <Export doc={doc} category={category} fileName={fileName} />
                    <OpenSource category={category} fileName={fileName} />
                    <Attribution doc={doc} />
                </Layout>
            </LightboxContainer>
        </>
    );
};
