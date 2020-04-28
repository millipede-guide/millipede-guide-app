import { useContext, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { StorageContext } from './Storage';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const CustomDialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});

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

    const addDate = () => {
        const d = Moment(selectedDate).format(dateStorageFormat);
        if (dates.indexOf(d) === -1) {
            setStorageDates([...dates, d]);
        }
        return d;
    };

    const removeDate = (date) => setStorageDates(dates.filter((i) => i !== date));

    return (
        <Dialog disableBackdropClick open={attr !== null}>
            <CustomDialogTitle onClose={() => setAttr(null)}>Log</CustomDialogTitle>
            <DialogContent>
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
                                        ? '#FFFFF0'
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
                <br />
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        format="DD/MM/YYYY"
                    />
                </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        addDate();
                    }}
                    color="primary"
                >
                    Add Date
                </Button>
            </DialogActions>
        </Dialog>
    );
};
