import Link from '@material-ui/core/Link';
import { allPhotosInDocument } from '../utils/allPhotosInDocument';
import { H2, P, ContentBox, ContentInner } from './Typography';

export const licenseUrls = {
    'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
    'CC BY-NC 2.0': 'https://creativecommons.org/licenses/by-nc/2.0/',
    'CC BY-NC-SA 2.0': 'https://creativecommons.org/licenses/by-nc-sa/2.0/',
    'CC BY-NC-SA 4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    'CC BY-ND 2.0': 'https://creativecommons.org/licenses/by-nd/2.0/',
    'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
    CC0: 'https://creativecommons.org/publicdomain/zero/1.0/',
};

const LicenseLink = ({ attr, license }) => (
    <>
        &copy; {attr}{' '}
        {license in licenseUrls ? <Link href={licenseUrls[license]}>{license}</Link> : license}
    </>
);

export default ({ doc }) => {
    const photos = {};

    allPhotosInDocument(doc).forEach(({ src, href, attr, license }, i) => {
        const k = JSON.stringify({
            attr,
            license,
        });
        if (!(k in photos)) photos[k] = {};
        photos[k][i] = href || src;
    });

    return (
        <ContentBox>
            <H2>Attribution</H2>
            <ContentInner>
                {Object.keys(photos).map(attr => (
                    <P key={attr}>
                        Photo{Object.keys(photos[attr]).length === 1 ? ' ' : 's '}
                        {Object.keys(photos[attr]).map((id, i2) => (
                            <span key={attr + id}>
                                <Link href={photos[attr][id]}>{id}</Link>
                                {i2 === Object.keys(photos[attr]).length - 1 ? ' ' : ', '}
                            </span>
                        ))}
                        <LicenseLink {...JSON.parse(attr)} />.
                    </P>
                ))}
                <P>
                    Document <LicenseLink attr={doc.copyright} license={doc.license} />.
                </P>
                <P>
                    Map data &copy; <Link href="https://www.openstreetmap.org/">OpenStreetMap</Link>{' '}
                    contributors{' '}
                    <Link href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</Link>
                    .
                </P>
            </ContentInner>
        </ContentBox>
    );
};
