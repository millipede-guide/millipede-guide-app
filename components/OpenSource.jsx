import Button from '@material-ui/core/Button';
import FileEditIcon from 'mdi-material-ui/FileEdit';
import AlertIcon from 'mdi-material-ui/Alert';
import MapIcon from 'mdi-material-ui/Map';
import { H2, ContentBox } from './Typography';

export default function OpenSource({ category, fileName }) {
    return (
        <ContentBox>
            <H2>Open Source</H2>
            <Button
                color="primary"
                href={`https://github.com/${process.env.GITHUB_REPOSITORY}/blob/master/${category}/${fileName}.yaml`}
                target="_blank"
                startIcon={<FileEditIcon />}
                style={{ marginRight: '1em' }}
            >
                Edit This Page
            </Button>
            <Button
                color="primary"
                href={`https://github.com/${
                    process.env.GITHUB_REPOSITORY
                }/issues/new?title=${encodeURIComponent(`Report: ${category}/${fileName}`)}`}
                target="_blank"
                startIcon={<AlertIcon />}
                style={{ marginRight: '1em' }}
            >
                Report An Issue
            </Button>
            <Button
                color="primary"
                href="https://www.openstreetmap.org/fixthemap"
                target="_blank"
                startIcon={<MapIcon />}
                style={{ marginRight: '1em' }}
            >
                Fix The Map
            </Button>
        </ContentBox>
    );
}
