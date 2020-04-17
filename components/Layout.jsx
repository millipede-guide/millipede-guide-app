import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Header from './Header';

export default ({ title, href, children }) => {
    return (
        <>
            <Header title={title} href={href} />
            <Container maxWidth="md" mt={3}>
                <Box mt={2} mb={3}>
                    {children}
                </Box>
            </Container>
        </>
    );
};
