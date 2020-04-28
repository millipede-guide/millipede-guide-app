import Moment from 'moment';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FileDownloadIcon from 'mdi-material-ui/Download';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import { useContext, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import humanize from 'underscore.string/humanize';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BookmarkIcon from 'mdi-material-ui/StarOutline';
import CompletedIcon from 'mdi-material-ui/CheckCircleOutline';
import FavouriteIcon from 'mdi-material-ui/HeartOutline';
import { StorageContext, storageKey, storageVersion } from '../components/Storage';
import Layout from '../components/Layout';
import { H2, P, ContentBox } from '../components/Typography';

export default () => {
    const [storage, setStorage] = useContext(StorageContext);
    const [loadedStorage, setLoadedStorage] = useState(null);
    const [restoreSuccessful, setRestoreSuccessful] = useState(null);
    const [isSafari, setIsSafari] = useState(false);

    const save = () => {
        if (document) {
            setStorage({ action: 'resetPageDataUpdates' });
            const format = 'application/json';
            const a = document.createElement('a');
            const data = JSON.stringify({ [storageKey]: { [storageVersion]: storage } }, null, 4);
            a.href = encodeURI(`data:${format};charset=utf-8,${data}`);
            a.download = `millipede-guide-${Moment().format('YYYY-MM-DD')}.json`;
            a.click();
        }
    };

    const load = (e) => {
        if (e.target.files.length !== 0) {
            const reader = new window.FileReader();
            reader.onload = (f) => {
                try {
                    const obj = JSON.parse(f.target.result);
                    const valid =
                        obj !== null &&
                        typeof obj === 'object' &&
                        typeof obj[storageKey] === 'object' &&
                        typeof obj[storageKey][storageVersion] === 'object';
                    setLoadedStorage(valid ? obj[storageKey][storageVersion] : 'invalid');
                } catch (err) {
                    setLoadedStorage('error');
                }
            };
            reader.readAsText(e.target.files[0]);
        }
    };

    const restore = () => {
        setStorage({ action: 'load', data: loadedStorage });
        setLoadedStorage(null);
        setRestoreSuccessful(true);
    };

    const validObject = (obj) => obj !== null && typeof obj === 'object';

    useEffect(() => {
        if (
            typeof navigator === 'object' &&
            /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        ) {
            // https://stackoverflow.com/a/23522755/5165
            setIsSafari(true);
        }
    }, []);

    return (
        <Layout title="Export" href="/export/">
            <ContentBox>
                <P>
                    All data for this app is privately stored on your device. It is never sent to a
                    server or shared with any other service.
                </P>
                <P>
                    This includes <BookmarkIcon fontSize="small" /> bookmarked,{' '}
                    <CompletedIcon fontSize="small" /> completed and{' '}
                    <FavouriteIcon fontSize="small" /> favourite items.
                </P>
                <P>You may backup your data or import it to another device as a JSON file.</P>
                <H2>Export / Backup</H2>
                <Box mt={2}>
                    <Badge
                        color="error"
                        badgeContent={
                            (storage && storage.pageData && storage.pageData.updates && 1) || null
                        }
                    >
                        <Button
                            onClick={() => save()}
                            variant="contained"
                            color="primary"
                            startIcon={<FileDownloadIcon />}
                        >
                            Download
                        </Button>
                    </Badge>
                </Box>
                <H2>Restore</H2>
                <Box mt={2}>
                    <input type="file" accept="application/json" onChange={load} />
                </Box>
                {loadedStorage !== null && (
                    <Dialog disableBackdropClick disableEscapeKeyDown open>
                        <DialogTitle>Restore</DialogTitle>
                        <DialogContent>
                            {loadedStorage === 'error' && <p>Error reading file.</p>}
                            {loadedStorage === 'invalid' && <p>Data seems to be invalid.</p>}
                            {validObject(loadedStorage) && (
                                <>
                                    {loadedStorage.lastModifiedDate && (
                                        <p>
                                            Exported:{' '}
                                            {Moment()
                                                .utc(loadedStorage.lastModifiedDate)
                                                .local()
                                                .format('Do MMM YYYY')}
                                        </p>
                                    )}
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell />
                                                    <TableCell align="center">
                                                        <BookmarkIcon fontSize="small" />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <CompletedIcon fontSize="small" />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <FavouriteIcon fontSize="small" />
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {[
                                                    'parks',
                                                    'campsites',
                                                    'routes',
                                                    'attractions',
                                                ].map((sup) => (
                                                    <TableRow key={sup}>
                                                        <TableCell component="th" scope="row">
                                                            {humanize(sup)}
                                                        </TableCell>
                                                        {['mark', 'done', 'favt'].map((sub) => (
                                                            <TableCell
                                                                key={sup + sub}
                                                                align="center"
                                                            >
                                                                {(storage.pageData &&
                                                                    storage.pageData[sup] &&
                                                                    Object.values(
                                                                        storage.pageData[sup],
                                                                    ).filter(
                                                                        (i) => i[sub] && i[sub].v,
                                                                    ).length) ||
                                                                    0}
                                                                &nbsp;&rsaquo;&nbsp;
                                                                <strong>
                                                                    {(loadedStorage.pageData &&
                                                                        loadedStorage.pageData[
                                                                            sup
                                                                        ] &&
                                                                        Object.values(
                                                                            loadedStorage.pageData[
                                                                                sup
                                                                            ],
                                                                        ).filter(
                                                                            (i) =>
                                                                                i[sub] && i[sub].v,
                                                                        ).length) ||
                                                                        0}
                                                                </strong>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <p>Please note, all existing data will be overwritten.</p>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setLoadedStorage(null)}>Cancel</Button>
                            <Button
                                onClick={() => restore()}
                                color="primary"
                                disabled={!validObject(loadedStorage)}
                            >
                                Restore
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {restoreSuccessful === true && (
                    <Dialog disableBackdropClick disableEscapeKeyDown open>
                        <DialogTitle>Restore Successful</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => setRestoreSuccessful(null)} color="primary">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {isSafari && (
                    <>
                        <H2>Note for iPhone/iPad Safari users</H2>
                        <P>
                            Please note, as a privacy measure, Apple has decided that Safari web
                            browser on the iPhone will delete all user data for a web site after 7
                            days of no activity.
                        </P>
                        <P>
                            To prevent that from happening and to keep your data indefinitely, you
                            must add this app to the home-screen of your device.
                        </P>
                        <Typography variant="body1" component="ol">
                            <li style={{ lineHeight: '2rem' }}>
                                Tap on the share/export icon{' '}
                                <span
                                    className="mdi mdi-export-variant"
                                    style={{ fontSize: '1.2rem' }}
                                />{' '}
                                in the middle of the toolbar at the bottom of the screen.
                            </li>
                            <li style={{ lineHeight: '2rem' }}>
                                Scroll until you find the option{' '}
                                <strong>
                                    Add to Home Screen{' '}
                                    <span
                                        className="mdi mdi-plus-box-outline"
                                        style={{ fontSize: '1.2rem' }}
                                    />
                                </strong>
                            </li>
                            <li style={{ lineHeight: '2rem' }}>
                                Choose <strong>Add</strong>
                            </li>
                            <li style={{ lineHeight: '2rem' }}>
                                From now on, launch the Millipede Guide via the Home Screen icon.
                            </li>
                        </Typography>
                    </>
                )}
            </ContentBox>
        </Layout>
    );
};
