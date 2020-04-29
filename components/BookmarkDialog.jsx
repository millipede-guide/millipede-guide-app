import { useContext, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Moment from 'moment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { StorageContext } from './Storage';

export default ({ category, id, attr, setAttr, dateStorageFormat, dateDisplayFormat }) => {
    const [storage, setStorage] = useContext(StorageContext);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (attr !== null) {
            try {
                const { log } = storage.pageData[category][id][attr];
                if (log !== undefined && typeof log === 'object') {
                    setDates([...log].sort());
                } else {
                    setDates([]);
                }
            } catch (e) {
                setDates([]);
            }
        }
    }, [storage, category, id, attr]);

    const setStorageDates = (newDates) => {
        setStorage({
            type: 'pageData',
            category,
            id,
            userUpate: true,
            key: attr,
            val: {
                log: newDates,
                at: Moment().format(dateStorageFormat),
            },
        });

        return newDates;
    };

    const addDate = (i) => {
        const d = Moment(i || selectedDate).format(dateStorageFormat);
        if (dates.indexOf(d) === -1) {
            setStorageDates([...dates, d]);
        }
        return d;
    };

    const removeDate = (date) => setStorageDates(dates.filter((i) => i !== date));

    return (
        <Dialog disableBackdropClick open={attr !== null}>
            <DialogTitle onClose={() => setAttr(null)}>Log</DialogTitle>
            <DialogContent>
                <Card>
                    <CardContent>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                variant="dialog"
                                okLabel="Add"
                                disableFuture
                                format="DD/MM/YYYY"
                                value={selectedDate}
                                onChange={setSelectedDate}
                                onAccept={(date) => {
                                    addDate(date);
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </CardContent>
                    <CardActions disableSpacing>
                        <div style={{ width: '100%', textAlign: 'right' }}>
                            <Button
                                onClick={() => {
                                    addDate();
                                }}
                                color="primary"
                            >
                                Add Date
                            </Button>
                        </div>
                    </CardActions>
                </Card>
                <br />
                <List dense>
                    <Divider />
                    {dates.length === 0 && (
                        <ListItem divider>
                            <ListItemText primary={<em>No dates logged yet.</em>} />
                        </ListItem>
                    )}
                    {dates.map((i) => (
                        <ListItem
                            key={i}
                            divider
                            style={{
                                backgroundColor:
                                    Moment(selectedDate).format(dateStorageFormat) === i
                                        ? '#F0FFF0'
                                        : 'inherit',
                            }}
                        >
                            <ListItemText
                                primary={Moment(i, dateStorageFormat).format(dateDisplayFormat)}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => removeDate(i)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setAttr(null);
                    }}
                >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};
