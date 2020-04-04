import dynamic from 'next/dynamic';
import AltitudeProfileContainer from './AltitudeProfileContainer';
import LeafletMapContainer from './LeafletMapContainer';

const LeafletMapDynamic = dynamic(() => import('./LeafletMapDynamic'), {
    ssr: false,
    loading: () => (
        <>
            <LeafletMapContainer />
            <AltitudeProfileContainer />
        </>
    ),
});

export default props => <LeafletMapDynamic {...props} showAltitudeProfile={true} />;
