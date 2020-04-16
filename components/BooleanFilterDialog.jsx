import { useContext, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import TrueIcon from 'mdi-material-ui/CheckCircleOutline';
import FalseIcon from 'mdi-material-ui/CloseCircleOutline';
import NullIcon from 'mdi-material-ui/MinusCircleOutline';
import Grid from '@material-ui/core/Grid';
import humanize from 'underscore.string/humanize';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import icon from '../utils/FeatureIcons';
import { StorageContext } from './Storage';

export default ({ open, setOpen, category, geo }) => {
    const defaultFilters = {
        features: {},
        restrictions: {},
        accessibility: {},
        getting_there: {},
    };

    const [storage, setStorage] = useContext(StorageContext);
    const [loaded, setLoaded] = useState(false);
    const [filters, setFilters] = useState(defaultFilters);

    useEffect(() => setLoaded(false), [geo]);

    const onEnter = () => {
        if ((!loaded && storage.available) || storage.error) {
            const obj = {
                ...defaultFilters,
                ...((!storage.error &&
                    storage.indexBooleanFilter &&
                    storage.indexBooleanFilter[category]) ||
                    {}),
            };

            if (geo && geo.features) {
                geo.features.forEach(geoFeature => {
                    Object.keys(defaultFilters).forEach(sup => {
                        if (geoFeature.properties[sup]) {
                            Object.keys(geoFeature.properties[sup]).forEach(sub => {
                                if (!(sub in obj[sup])) {
                                    obj[sup][sub] = null;
                                }
                            });
                        }
                    });
                });
            }
            setFilters(obj);
            setLoaded(true);
        }
    };

    const cycle = v => {
        if (v === null) return true;
        if (v === true) return false;
        return null;
    };

    const toggle = (sup, sub) =>
        setFilters({ ...filters, [sup]: { ...filters[sup], [sub]: cycle(filters[sup][sub]) } });

    const reset = () => {
        const obj = { ...filters };
        Object.keys(obj).forEach(sup => {
            Object.keys(obj[sup]).forEach(sub => {
                obj[sup][sub] = null;
                return null;
            });
        });
        setFilters(obj);
    };

    const updateStorage = () =>
        setStorage({ action: 'indexBooleanFilter', category, data: filters });

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            onEnter={onEnter}
            onClose={() => setOpen(false)}
        >
            <DialogContent>
                {Object.keys(filters).map(sup => (
                    <Box key={sup}>
                        <Box mt={3} mb={2}>
                            <Typography variant="h2">{humanize(sup)}</Typography>
                        </Box>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                        >
                            {Object.keys(filters[sup]).map(sub => (
                                <Grid item key={sup + sub}>
                                    <Chip
                                        variant="outlined"
                                        label={humanize(sub)}
                                        icon={icon(sub)}
                                        onClick={() => toggle(sup, sub)}
                                        onDelete={() => toggle(sup, sub)}
                                        deleteIcon={
                                            (filters[sup][sub] === true && (
                                                <TrueIcon style={{ color: 'green' }} />
                                            )) ||
                                            (filters[sup][sub] === false && (
                                                <FalseIcon style={{ color: 'red' }} />
                                            )) || <NullIcon />
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={reset}>Reset</Button>
                <Button
                    onClick={() => {
                        setOpen(false);
                        updateStorage();
                    }}
                    color="primary"
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};
