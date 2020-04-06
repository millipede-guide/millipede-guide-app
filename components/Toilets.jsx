import LocationCards from './LocationCards';
import { H2, ContentBox } from './Typography';

export default ({ doc }) => (
    <>
        {'toilets' in doc && doc.toilets.length > 0 && (
            <ContentBox>
                <H2>Toilets</H2>
                <LocationCards items={doc.toilets} keys={['type', 'wheelchair']} />
            </ContentBox>
        )}
    </>
);
