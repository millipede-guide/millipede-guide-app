import Layout from '../components/Layout';
import { ContentBox, P } from '../components/Typography';

export default () => (
    <Layout title="About" href="/about/">
        <ContentBox>
            <P>
                The Millipede Guide is a collaborate, open-source guide to the natural world
                including heritage listed areas, parks, attractions, campsites and walking (or
                cycling) routes
            </P>
            <P>
                The guide aims to include basic, qualitative, fact-based information with geotags
                for everything.
            </P>
            <P>
                Photos in the guide aim to show as much information as possible and represent
                average conditions. For example, if a walking route includes a spectacular view but
                also very steep steps with heavy erosion, this guide will include a photo of the
                steps.
            </P>
            <P>
                Geotagged information is easily viewable on built-in maps as well as downloads for
                common file formats and links to OSM, Google and Apple maps.
            </P>
            <P>
                Icon/logo image is by{' '}
                <a href="https://www.needpix.com/photo/download/1278472/worm-centipedes-free-pictures-free-photos-free-images-royalty-free-free-illustrations">
                    charlygutmann (pixabay.com)
                </a>
            </P>
        </ContentBox>
    </Layout>
);
