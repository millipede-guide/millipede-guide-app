import Container from '@material-ui/core/Container';
import Header from './Header';

export default ({ children }) => (
    <>
        <Header />
        <Container maxWidth="md">
            {children}
            <br />
            <br />
        </Container>
    </>
);
