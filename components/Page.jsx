import humanize from 'underscore.string/humanize';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Head from 'next/head';
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

export default ({ dir, id, doc, jsonUrl }) => {
    return (
        <>
            <Head>
                <title>{`${doc.name}, ${doc.region}, ${doc.country}`}</title>
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://www.millipede-guide.com/${dir}/${id}`} />
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
                <Layout>
                    <br />
                    <Breadcrumbs>
                        <Link href={`/${dir}/all`}>{humanize(dir)}</Link>
                        <Typography color="secondary">{doc.country}</Typography>
                        <Typography color="secondary">{doc.region}</Typography>
                        {'park' in doc && <Typography color="secondary">{doc.park}</Typography>}
                    </Breadcrumbs>
                    <H1>{doc.name}</H1>
                    <MapToolbar dir={dir} id={id} doc={doc} />
                    <GeoJsonMap
                        center={doc.location}
                        geoJsonUrl={jsonUrl.replace('.json', '.geo.json')}
                        showAltitudeProfile={dir === 'routes'}
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
                    <WebsiteLinks doc={doc} />
                    <Export doc={doc} jsonUrl={jsonUrl} />
                    <OpenSource jsonUrl={jsonUrl} />
                    <Attribution doc={doc} />
                </Layout>
            </LightboxContainer>
        </>
    );
};
