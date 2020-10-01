import ParksIcon from 'mdi-material-ui/ImageFilterHdr';
import CampsitesIcon from 'mdi-material-ui/Tent';
import RoutesIcon from 'mdi-material-ui/Walk';
import AttractionsIcon from 'mdi-material-ui/Binoculars';

export default function CategoryIcon({ category }) {
    return (
        <>
            {category === 'parks' && <ParksIcon />}
            {category === 'attractions' && <AttractionsIcon />}
            {category === 'routes' && <RoutesIcon />}
            {category === 'campsites' && <CampsitesIcon />}
        </>
    );
}
