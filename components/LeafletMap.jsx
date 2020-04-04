import dynamic from 'next/dynamic';
import LeafletMapContainer from './LeafletMapContainer';

const LeafletMapDynamic = dynamic(() => import('./LeafletMapDynamic'), {
    ssr: false,
    loading: () => <LeafletMapContainer />,
});

export default props => <LeafletMapDynamic {...props} />;
