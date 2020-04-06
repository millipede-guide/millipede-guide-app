import { H2, ContentBox, ContentInner } from './Typography';
import GridChips from './GridChips';

export default ({ doc }) => (
    <>
        {'access' in doc && Object.keys(doc.access).length > 0 && (
            <>
                <ContentBox>
                    <H2>Features</H2>
                    <ContentInner>
                        <GridChips obj={doc.access} />
                    </ContentInner>
                </ContentBox>
            </>
        )}
    </>
);
