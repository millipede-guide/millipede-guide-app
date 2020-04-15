import { makeStyles } from '@material-ui/core/styles';
import { useContext, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { StorageContext } from './Storage';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default ({ dialog, showDialog, category, geoLocations }) => {
    const classes = useStyles();

    const [storage, setStorage] = useContext(StorageContext);

    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [park, setPark] = useState('');

    const setFilter = filter => setStorage({ action: 'indexFilter', data: filter });

    useEffect(() => {
        setCountry((storage.indexFilter && storage.indexFilter.country) || '');
        setRegion((storage.indexFilter && storage.indexFilter.region) || '');
        setPark((storage.indexFilter && storage.indexFilter.park) || '');
    }, [storage]);

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={dialog}
            onClose={() => showDialog(false)}
        >
            <DialogTitle>Filter Options</DialogTitle>
            <DialogContent>
                <form className={classes.container}>
                    <div>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="country-label">Country</InputLabel>
                            <Select
                                labelId="country-label"
                                id="country-select"
                                value={country}
                                onChange={e => {
                                    setPark('');
                                    setRegion('');
                                    setCountry(e.target.value);
                                }}
                                label="Country"
                            >
                                <MenuItem aria-label="None" value="">
                                    <em>All</em>
                                </MenuItem>
                                {Object.keys(geoLocations).map(i => (
                                    <MenuItem key={i} value={i}>
                                        {i}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    {country && geoLocations[country] && (
                        <div>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="region-label">Region</InputLabel>
                                <Select
                                    labelId="region-label"
                                    id="region-select"
                                    value={region}
                                    onChange={e => {
                                        setPark('');
                                        setRegion(e.target.value);
                                    }}
                                    label="Region"
                                >
                                    <MenuItem aria-label="None" value="">
                                        <em>All</em>
                                    </MenuItem>
                                    {Object.keys(geoLocations[country]).map(i => (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                    {category !== 'parks' &&
                        country &&
                        region &&
                        geoLocations[country] &&
                        geoLocations[country][region] && (
                            <div>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="park-label">Park</InputLabel>
                                    <Select
                                        labelId="park-label"
                                        id="park-select"
                                        value={park}
                                        onChange={e => setPark(e.target.value)}
                                        label="Park"
                                    >
                                        <MenuItem aria-label="None" value="">
                                            <em>All</em>
                                        </MenuItem>
                                        {geoLocations[country][region].map(i => (
                                            <MenuItem key={i} value={i}>
                                                {i}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        showDialog(false);
                        setFilter({});
                    }}
                >
                    Reset
                </Button>
                <Button
                    onClick={() => {
                        showDialog(false);
                        setFilter({ country, region, park });
                    }}
                    color="primary"
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};
