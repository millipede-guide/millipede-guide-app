import Button from '@material-ui/core/Button';
import FileEditIcon from 'mdi-material-ui/FileEdit';
import Box from '@material-ui/core/Box';
import AlertIcon from 'mdi-material-ui/Alert';
import { H2, P, ContentBox } from './Typography';

export default ({ category, fileName }) => (
    <ContentBox>
        <H2>Open Source</H2>
        <Box mt={1}>
            <P>You can help improve, update and correct this web page, just like any other wiki.</P>
            <P>This page is compiled from a single, simple, hand-written file (in YAML format).</P>
            <P>All you need to get started is a free Github account!</P>
        </Box>
        <Button
            color="primary"
            href={`https://github.com/millipede-guide/millipede-guide-docs/blob/master/${category}/${fileName}.yaml`}
            startIcon={<FileEditIcon />}
            style={{ marginRight: '1em' }}
        >
            Edit This Page
        </Button>
        <Button
            color="primary"
            href={`https://github.com/millipede-guide/millipede-guide-docs/issues/new?title=${encodeURIComponent(
                `Report: ${category}/${fileName}`,
            )}`}
            startIcon={<AlertIcon />}
            style={{ marginRight: '1em' }}
        >
            Report An Issue
        </Button>
    </ContentBox>
);
