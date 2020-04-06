import { H2, ContentBox, ContentInner } from './Typography';
import GridChips from './GridChips';

export default ({ doc }) => (
    <>
        {'features' in doc && Object.keys(doc.features).length > 0 && (
            <>
                <ContentBox>
                    <H2>Features</H2>
                    <ContentInner>
                        <GridChips obj={doc.features} />
                    </ContentInner>
                </ContentBox>
            </>
        )}
    </>
);
