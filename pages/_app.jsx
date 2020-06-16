import 'normalize.css/normalize.css';
import '@mdi/font/css/materialdesignicons.min.css';
import 'react-image-lightbox/style.css';
import 'typeface-roboto/index.css';
import './_app.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import App from 'next/app';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/theme';

import { StorageProvider } from '../components/Storage';

export default class CustomApp extends App {
    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <StorageProvider>
                <ThemeProvider theme={responsiveFontSizes(createMuiTheme(theme))}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </StorageProvider>
        );
    }
}
