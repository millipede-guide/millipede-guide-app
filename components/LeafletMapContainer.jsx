import Paper from '@material-ui/core/Paper';
import { ContentBox } from './Typography';

export default ({ children }) => (
    <ContentBox>
        <Paper elevation={1}>{children || <div style={{ height: '25vh' }} />}</Paper>
    </ContentBox>
);
