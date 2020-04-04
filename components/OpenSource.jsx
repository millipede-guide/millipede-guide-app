import Button from '@material-ui/core/Button';
import FileEdit from 'mdi-material-ui/FileEdit';
import Git from 'mdi-material-ui/GithubCircle';
import Box from '@material-ui/core/Box';
import { H2, P, ContentBox } from './Typography';

export default ({ jsonUrl }) => (
    <ContentBox>
        <H2>Open Source</H2>
        <Box mt={1}>
            <P>You can help improve, update and correct this web page, just like any other wiki.</P>
            <P>This page is compiled from a single, simple, hand-written file (in YAML format).</P>
            <P>All you need to get started is a free Github account!</P>
        </Box>
        <Button
            color="primary"
            href="https://github.com/millipede-guide/millipede-guide-docs"
            startIcon={<Git />}
            style={{ marginRight: '1em' }}
        >
            Github
        </Button>
        <Button
            color="primary"
            href={`https://github.com/millipede-guide/millipede-guide-docs/blob/master/${jsonUrl
                .replace('/export/', '')
                .replace('.json', '.yaml')}`}
            startIcon={<FileEdit />}
            style={{ marginRight: '1em' }}
        >
            Edit This Page
        </Button>
    </ContentBox>
);
