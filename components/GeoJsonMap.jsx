import Paper from '@material-ui/core/Paper';
import { useRef, useState, useEffect } from 'react';
import humanize from 'underscore.string/humanize';
import { ContentBox } from './Typography';
import GeoJsonAltitudeProfile from './GeoJsonAltitudeProfile';
import { markerTypes, markerIcons, pointToLayer, onEachFeature } from '../utils/mapMarkers';

export default ({ center, geoJsonUrl, showAltitudeProfile }) => {
    const mapRef = useRef(null);
    const [geo, setGeo] = useState(null);

    const setDynamicStyle = (zoom) => {
        let scale = zoom / 18;
        if (scale < 0.6) scale = 0.6;
        document.getElementById('mapDynamicStyle').innerHTML = `.mapicon { transform: scale(${
            scale > 1 ? 1 : scale
        }); }`;
    };

    useEffect(() => {
        if (typeof window === 'object' && typeof window.L === 'object') {
            if (geoJsonUrl) {
                window.fetch(geoJsonUrl).then((response) => {
                    response.json().then((data) => setGeo(data));
                });
            }
        }
    }, []);

    useEffect(() => {
        if (geo && geo.type && geo.type === 'FeatureCollection') {
            if (typeof window === 'object' && typeof window.L === 'object') {
                const osmBaseLayer = window.L.tileLayer(
                    'https://tile.millipede-guide.com/{z}/{x}/{y}.png',
                    {
                        attribution:
                            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    },
                );

                const baseLayers = {
                    'Street Map': osmBaseLayer,
                };

                const featuresLayer = window.L.geoJSON(geo, {
                    pointToLayer,
                    onEachFeature,
                    filter: (f) =>
                        f.geometry.type !== 'Point' ||
                        markerTypes.indexOf(f.properties.type) === -1,
                });

                const markerLayers = {};

                markerTypes.forEach((t) => {
                    const points = geo.features.filter(
                        (f) =>
                            f.geometry.type === 'Point' && f.properties && f.properties.type === t,
                    );

                    if (points.length > 0) {
                        markerLayers[
                            `<span class="mdi mdi-${markerIcons[t]}"></span> ${humanize(t)}`
                        ] = window.L.geoJSON(
                            {
                                type: 'FeatureCollection',
                                features: points,
                            },
                            {
                                pointToLayer,
                                onEachFeature,
                            },
                        );
                    }
                });

                const lMap = window.L.map('mapContainer', {
                    center,
                    zoom: 4,
                    scrollWheelZoom: true,
                    fullscreenControl: {
                        pseudoFullscreen: true,
                    },
                    layers: [osmBaseLayer, featuresLayer, ...Object.values(markerLayers)],
                });

                setDynamicStyle(4);

                window.L.control
                    .layers(baseLayers, markerLayers, { autoZIndex: false, hideSingleBase: true })
                    .addTo(lMap);

                lMap.fitBounds(window.L.geoJSON(geo).getBounds(), {
                    animate: false,
                    padding: [10, 10],
                });

                mapRef.current = lMap;

                lMap.on('zoomend', () => setDynamicStyle(lMap.getZoom()));
            }
        }
    }, [geo]);

    return (
        <ContentBox>
            <Paper elevation={1}>
                <div id="mapContainer" style={{ height: '25vh', minHeight: '240px' }} />
            </Paper>
            <style id="mapDynamicStyle" />
            {showAltitudeProfile && <GeoJsonAltitudeProfile mapRef={mapRef} geo={geo} />}
        </ContentBox>
    );
};
