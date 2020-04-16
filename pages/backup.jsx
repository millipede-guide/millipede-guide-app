import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FileDownloadIcon from 'mdi-material-ui/FileDownload';
import Typography from '@material-ui/core/Typography';
import Head from 'next/head';
import Badge from '@material-ui/core/Badge';
import { H1, H2, P } from '../components/Typography';
import Layout from '../components/Layout';
import { StorageContext, storageKey } from '../components/Storage';

export default () => {
    const download = (storage, setStorage) => {
        if (document) {
            setStorage({ action: 'resetPageDataUpdates' });
            const format = 'application/json';
            const a = document.createElement('a');
            const data = JSON.stringify({ [storageKey]: storage }, null, 4);
            a.href = encodeURI(`data:${format};charset=utf-8,${data}`);
            a.download = 'millipede-guide.json';
            a.click();
        }
    };

    return (
        <Layout>
            <Head>
                <title>Backup - Millipede Guide</title>
            </Head>
            <Box mt={3}>
                <H1>Backup / Export</H1>
            </Box>
            <Box mt={2}>
                <P>
                    All data for this app is privately stored on your device. It is never sent to a
                    server or shared with any other service.
                </P>
                <P>
                    This includes bookmarked (star), completed (check) and favourite (heart) items.
                </P>
                <P>You may backup your data or import it to another device as a JSON file.</P>
                <Box mt={2}>
                    <StorageContext.Consumer>
                        {([storage, setStorage]) => (
                            <Badge
                                color="error"
                                badgeContent={
                                    (storage &&
                                        storage.pageData &&
                                        storage.pageData.updates &&
                                        1) ||
                                    null
                                }
                            >
                                <Button
                                    onClick={() => download(storage, setStorage)}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<FileDownloadIcon />}
                                >
                                    Download
                                </Button>
                            </Badge>
                        )}
                    </StorageContext.Consumer>
                </Box>
                <H2>Note for iPhone</H2>
                <P>
                    Please note, as a privacy measure, Apple has decided that Safari web browser on
                    the iPhone will delete all user data for a web site after 7 days of no activity.
                </P>
                <P>
                    To prevent that from happening and to keep your data indefinitely, you must add
                    this app to the home-screen of your device.
                </P>
                <Typography variant="body1" component="ol">
                    <li style={{ lineHeight: '2rem' }}>
                        Tap on the share/export icon{' '}
                        <span className="mdi mdi-export-variant" style={{ fontSize: '1.2rem' }} />{' '}
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
            </Box>
        </Layout>
    );
};
