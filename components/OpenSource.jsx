import Button from '@material-ui/core/Button';
import FileEditIcon from 'mdi-material-ui/FileEdit';
import AlertIcon from 'mdi-material-ui/Alert';
import MapIcon from 'mdi-material-ui/Map';
import { H2, ContentBox } from './Typography';

export default ({ category, fileName }) => (
    <ContentBox>
        <H2>Open Source</H2>
        <Button
            color="primary"
            href={`https://${process.env.githubDocsUrl}/blob/master/${category}/${fileName}.yaml`}
            startIcon={<FileEditIcon />}
            style={{ marginRight: '1em' }}
        >
            Edit This Page
        </Button>
        <Button
            color="primary"
            href={`https://${process.env.githubDocsUrl}/issues/new?title=${encodeURIComponent(
                `Report: ${category}/${fileName}`,
            )}`}
            startIcon={<AlertIcon />}
            style={{ marginRight: '1em' }}
        >
            Report An Issue
        </Button>
        <Button
            color="primary"
            href="https://www.openstreetmap.org/fixthemap"
            startIcon={<MapIcon />}
            style={{ marginRight: '1em' }}
        >
            Fix The Map
        </Button>
    </ContentBox>
);
