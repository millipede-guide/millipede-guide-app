import Button from '@material-ui/core/Button';
import FileCode from 'mdi-material-ui/FileCode';
import FileDocument from 'mdi-material-ui/FileDocument';
import FileLink from 'mdi-material-ui/FileLink';
import { H2, ContentBox } from './Typography';
// import FileCog from 'mdi-material-ui/FileCog';
// import FileStar from 'mdi-material-ui/FileStar';
// import FileTable from 'mdi-material-ui/FileTable';

const iconMap = {
    gpx: FileCode,
    kml: FileCode,
    'geo.json': FileLink,
    json: FileLink,
    yaml: FileDocument,
};

const icon = (i) => {
    const Icon = iconMap[i];
    return <Icon />;
};

export default ({ category, fileName }) => (
    <ContentBox>
        <H2>File Downloads</H2>
        {Object.keys(iconMap).map((ext) => (
            <Button
                key={ext}
                color="primary"
                href={`${process.env.assetPrefix}/export/${category}/${fileName}.${ext}`}
                target="_blank"
                startIcon={icon(ext)}
                style={{ marginRight: '1em' }}
            >
                {ext.toUpperCase()}
            </Button>
        ))}
    </ContentBox>
);
