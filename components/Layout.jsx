import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import Header from './Header';

export default ({ title, href, as, windowTitle, children }) => {
    return (
        <>
            <Head>
                <title>
                    {[windowTitle || title, process.env.appShortName].filter(Boolean).join(' - ')}
                </title>
                <meta property="og:title" content={windowTitle || title} />
            </Head>
            <Header title={title} href={href} as={as} />
            <Container maxWidth="md" mt={3}>
                <Box mt={2} mb={3}>
                    {children}
                </Box>
            </Container>
        </>
    );
};
