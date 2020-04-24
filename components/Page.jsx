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
import { getFeaturePhoto } from '../utils/getFeaturePhoto';

export default ({ category, id, doc, fileName }) => {
    return (
        <>
            <Head>
                <title>
                    {[doc.name, doc.park, doc.region, doc.country].filter(Boolean).join(', ')} -{' '}
                    {humanize(category)} - Millipede Guide
                </title>
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={`https://www.millipede-guide.com/${category}/${id}`}
                />
                <meta property="og:title" content={doc.name} />
                <meta
                    property="og:description"
                    content={['park' in doc ? doc.park : null, doc.region, doc.country]
                        .filter(Boolean)
                        .join(', ')}
                />
                {doc.photos && doc.photos.length > 0 && (
                    <meta
                        property="og:image"
                        content={`https://www.millipede-guide.com/photos/sm/${
                            photoIndex[getFeaturePhoto(doc.photos).src].hash
                        }.jpg`}
                    />
                )}
            </Head>
            <LightboxContainer>
                <Layout title={humanize(category)} href={`/${category}/all/`}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        spacing={1}
                        wrap="wrap-reverse"
                    >
                        <Grid item>
                            <H1>{doc.name}</H1>
                        </Grid>
                        <Grid item>
                            <StorageContext.Consumer>
                                {([, setStorage]) => (
                                    <Breadcrumbs separator="&rsaquo;">
                                        {doc.park && (
                                            <Link
                                                href={`/${category}/all/`}
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
                                            href={`/${category}/all/`}
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
                                            href={`/${category}/all/`}
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
                    <Infrastructure heading="Transport" items={doc.transport} />
                    <Infrastructure heading="Parking" items={doc.parking} />
                    <Infrastructure heading="Water" items={doc.water} />
                    <Infrastructure heading="Toilets" items={doc.toilets} />
                    <Infrastructure heading="Shelter" items={doc.shelter} />
                    <Infrastructure heading="Information" items={doc.information} />
                    <WebsiteLinks doc={doc} />
                    <Export doc={doc} category={category} fileName={fileName} />
                    <OpenSource category={category} fileName={fileName} />
                    <Attribution doc={doc} />
                </Layout>
            </LightboxContainer>
        </>
    );
};
