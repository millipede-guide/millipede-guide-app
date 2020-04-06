import LocationCards from './LocationCards';
import { H2, ContentBox } from './Typography';

export default ({ doc }) => (
    <>
        {'parking' in doc && doc.parking.length > 0 && (
            <ContentBox>
                <H2>Car Parking</H2>
                <LocationCards items={doc.parking} keys={['fee']} />
            </ContentBox>
        )}
    </>
);
