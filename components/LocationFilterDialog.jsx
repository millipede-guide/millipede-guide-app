import { useContext, useState, useEffect, useMemo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { StorageContext } from './Storage';

export default ({ open, setOpen, category, geo }) => {
    const [storage, setStorage] = useContext(StorageContext);

    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [park, setPark] = useState('');

    const setFilter = (filter) => setStorage({ action: 'indexLocationFilter', data: filter });

    useEffect(() => {
        setCountry((storage.indexLocationFilter && storage.indexLocationFilter.country) || '');
        setRegion((storage.indexLocationFilter && storage.indexLocationFilter.region) || '');
        setPark((storage.indexLocationFilter && storage.indexLocationFilter.park) || '');
    }, [storage]);

    const geoLocations = useMemo(() => {
        const locations = {};

        if (geo) {
            geo.features.forEach((feature) => {
                const { country: c, region: r, park: p } = feature.properties;
                if (c) {
                    if (locations[c] === undefined) locations[c] = {};
                    if (r) {
                        if (locations[c][r] === undefined) locations[c][r] = [];
                        if (category !== 'parks' && p && locations[c][r].indexOf(p) === -1)
                            locations[c][r].push(p);
                    }
                }
            });
        }

        return locations;
    }, [geo]);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Select Location</DialogTitle>
            <DialogContent>
                <Box>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="country-label">Country</InputLabel>
                        <Select
                            labelId="country-label"
                            id="country-select"
                            value={country}
                            onChange={(e) => {
                                setPark('');
                                setRegion('');
                                setCountry(e.target.value);
                            }}
                            label="Country"
                            placeholder="All"
                            autoWidth={false}
                        >
                            <MenuItem aria-label="None" value="">
                                <em>All</em>
                            </MenuItem>
                            {Object.keys(geoLocations).map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {country && geoLocations[country] && (
                    <Box mt={3}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="region-label">Region</InputLabel>
                            <Select
                                labelId="region-label"
                                id="region-select"
                                value={region}
                                onChange={(e) => {
                                    setPark('');
                                    setRegion(e.target.value);
                                }}
                                label="Region"
                                placeholder="All"
                                autoWidth={false}
                            >
                                <MenuItem aria-label="None" value="">
                                    <em>All</em>
                                </MenuItem>
                                {Object.keys(geoLocations[country]).map((i) => (
                                    <MenuItem key={i} value={i}>
                                        {i}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
                {category !== 'parks' &&
                    country &&
                    region &&
                    geoLocations[country] &&
                    geoLocations[country][region] && (
                        <Box mt={3}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="park-label">Park</InputLabel>
                                <Select
                                    labelId="park-label"
                                    id="park-select"
                                    value={park}
                                    onChange={(e) => setPark(e.target.value)}
                                    label="Park"
                                    placeholder="All"
                                    autoWidth={false}
                                >
                                    <MenuItem aria-label="None" value="">
                                        <em>All</em>
                                    </MenuItem>
                                    {geoLocations[country][region].map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setPark('');
                        setRegion('');
                        setCountry('');
                    }}
                >
                    Reset
                </Button>
                <Button
                    onClick={() => {
                        setOpen(false);
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
