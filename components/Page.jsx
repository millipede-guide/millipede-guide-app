import humanize from 'underscore.string/humanize';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Head from 'next/head';
import LightboxContainer from './LightboxContainer';
import Layout from './Layout';
import MapToolbar from './MapToolbar';
import LeafletMap from './LeafletMap';
import LeafletMapWithAltitudeProfile from './LeafletMapWithAltitudeProfile';
import Photos from './Photos';
import Attribution from './Attribution';
import WebsiteLinks from './WebsiteLinks';
import Features from './Features';
import Access from './Access';
import Parking from './Parking';
import Water from './Water';
import Toilets from './Toilets';
import Export from './Export';
import OpenSource from './OpenSource';
import { H1 } from './Typography';
import Link from './Link';

export default ({ dir, id, doc, jsonUrl }) => {
    const Map = dir === 'routes' ? LeafletMapWithAltitudeProfile : LeafletMap;
    return (
        <>
            <Head>
                <title>{`${doc.name}, ${doc.region}, ${doc.country}`}</title>
                <meta property="og:site_name" content="The Millipede Guide" />
                <meta property="og:title" content={`${doc.name}, ${doc.region}, ${doc.country}`} />
                <meta property="og:type" content="website" />
                {'photos' in doc && doc.photos.length > 0 && (
                    <meta property="og:image" content={doc.photos[0].src} />
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
                    <Map center={doc.location} geoJsonUrl={jsonUrl.replace('.json', '.geo.json')} />
                    <Photos doc={doc} />
                    <Features doc={doc} />
                    <Access doc={doc} />
                    <Parking doc={doc} />
                    <Water doc={doc} />
                    <Toilets doc={doc} />
                    <WebsiteLinks doc={doc} />
                    <Export doc={doc} jsonUrl={jsonUrl} />
                    <OpenSource jsonUrl={jsonUrl} />
                    <Attribution doc={doc} />
                </Layout>
            </LightboxContainer>
        </>
    );
};
