import Button from '@material-ui/core/Button';
import FileCode from 'mdi-material-ui/FileCode';
import FileDocument from 'mdi-material-ui/FileDocument';
import FileLink from 'mdi-material-ui/FileLink';
import { H2, ContentBox } from './Typography';
// import FileCog from 'mdi-material-ui/FileCog';
// import FileStar from 'mdi-material-ui/FileStar';
// import FileTable from 'mdi-material-ui/FileTable';

const iconMap = {
    yaml: FileDocument,
    json: FileLink,
    'geo.json': FileLink,
    gpx: FileCode,
    kml: FileCode,
};

const icon = i => {
    const Icon = iconMap[i];
    return <Icon />;
};

export default ({ jsonUrl }) => (
    <ContentBox>
        <H2>Downloads</H2>
        {Object.keys(iconMap).map(ext => (
            <Button
                key={ext}
                color="primary"
                href={
                    ext === 'yaml'
                        ? jsonUrl.replace('/export/', '/docs/').replace('.json', '.yaml')
                        : jsonUrl.replace('.json', `.${ext}`)
                }
                startIcon={icon(ext)}
                style={{ marginRight: '1em' }}
            >
                {ext.toUpperCase()}
            </Button>
        ))}
    </ContentBox>
);
