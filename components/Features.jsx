import humanize from 'underscore.string/humanize';
import truncate from 'underscore.string/truncate';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { H2, ContentBox, ContentInner } from './Typography';
import icon from '../utils/FeatureIcons';

export default ({ heading, features }) => {
    const chips = (items) =>
        items.map((i) => (
            <Grid item key={`${i}${features[i]}`}>
                <Chip
                    variant="outlined"
                    icon={icon(i)}
                    label={truncate(humanize(i), 22)}
                    title={humanize(i)}
                    disabled={!features[i]}
                    className={features[i] ? null : 'diagonal-line'}
                />
            </Grid>
        ));

    return (
        <>
            {features !== undefined && Object.keys(features).length > 0 && (
                <ContentBox>
                    <H2>{heading}</H2>
                    <ContentInner>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                        >
                            {chips(Object.keys(features).filter((i) => features[i]))}
                            {chips(Object.keys(features).filter((i) => !features[i]))}
                        </Grid>
                    </ContentInner>
                </ContentBox>
            )}
        </>
    );
};
