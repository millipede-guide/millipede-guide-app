import Paper from '@material-ui/core/Paper';
import { useRef, useState, useEffect } from 'react';
import humanize from 'underscore.string/humanize';
import { ContentBox } from './Typography';
import GeoJsonAltitudeProfile from './GeoJsonAltitudeProfile';
import { markerIcons, pointToLayer, onEachFeature } from '../utils/mapMarkers';
import photosIndex from '../public/photos/index.json';
import docToGeoJson from '../utils/docToGeoJson';

const geoTemplate = {
    type: 'FeatureCollection',
    features: [],
};

export default ({ doc, center, category, fileName, showAltitudeProfile }) => {
    const [geoBase, setGeoBase] = useState(null);
    const mapRef = useRef(null);
    const geoBaseLayer = useRef(null);

    const setDynamicStyle = (zoom) => {
        let scale = zoom / 18;
        if (scale < 0.6) scale = 0.6;
        document.getElementById('mapDynamicStyle').innerHTML = `.mapicon { transform: scale(${
            scale > 1 ? 1 : scale
        }); }`;
    };

    useEffect(() => {
        if (typeof window === 'object' && typeof window.L === 'object') {
            const osmBaseLayer = window.L.tileLayer(
                `https://${process.env.osmHost}/{z}/{x}/{y}.png`,
                {
                    attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                },
            );

            const thuderforestBaseLayer = window.L.tileLayer(
                `https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=${process.env.tfApiKey}`,
                {
                    attribution:
                        '<a href="https://www.thunderforest.com/maps/landscape/">thunderforest.com</a>',
                },
            );

            const baseLayers = {
                Streets: osmBaseLayer,
                Terrain: thuderforestBaseLayer,
            };

            const featureLayers = {};

            geoBaseLayer.current = window.L.layerGroup();

            featureLayers['<span class="mdi mdi-map-marker-path"></span> Path'] =
                geoBaseLayer.current;

            const geoMarkers = docToGeoJson(category, doc, { ...geoTemplate }, photosIndex);

            Object.keys(markerIcons).forEach((t) => {
                const markerFeatures = geoMarkers.features.filter(
                    (f) => f.geometry.type === 'Point' && f.properties && f.properties.type === t,
                );

                if (markerFeatures.length > 0) {
                    featureLayers[
                        `<span class="mdi mdi-${markerIcons[t]}"></span> ${humanize(t)}`
                    ] = window.L.geoJSON(
                        {
                            ...geoTemplate,
                            features: markerFeatures,
                        },
                        {
                            pointToLayer,
                            onEachFeature: (f, l) => onEachFeature(f, l, photosIndex),
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
                layers: [osmBaseLayer, ...Object.values(featureLayers)],
            });

            setDynamicStyle(4);

            window.L.control
                .layers(baseLayers, featureLayers, { autoZIndex: false, hideSingleBase: true })
                .addTo(lMap);

            lMap.fitBounds(window.L.geoJSON(geoBase || geoMarkers).getBounds(), {
                animate: false,
                padding: [10, 10],
            });

            lMap.on('zoomend', () => setDynamicStyle(lMap.getZoom()));

            mapRef.current = lMap;
        }
    }, [doc]);

    useEffect(() => {
        if (typeof window === 'object' && typeof window.L === 'object') {
            window
                .fetch(`${process.env.assetPrefix}/content/${category}/${fileName}.geo.json`)
                .then((response) => {
                    if (response.ok) {
                        response.json().then((obj) => {
                            setGeoBase(obj);
                        });
                    }
                });
        }
    }, []);

    useEffect(() => {
        if (geoBase !== null && geoBase.type && geoBase.type === 'FeatureCollection') {
            if (typeof window === 'object' && typeof window.L === 'object') {
                const geo = window.L.geoJSON(geoBase, {
                    pointToLayer: (feature, latlng) => window.L.circleMarker(latlng, { radius: 1 }),
                    style: {
                        fillOpacity: 0,
                    },
                }).addTo(geoBaseLayer.current);
                mapRef.current.fitBounds(geo.getBounds(), {
                    animate: false,
                    padding: [10, 10],
                });
            }
        }
    }, [geoBase]);

    return (
        <ContentBox>
            <Paper elevation={1}>
                <div id="mapContainer" style={{ height: '25vh', minHeight: '240px' }} />
            </Paper>
            <style id="mapDynamicStyle" />
            {showAltitudeProfile && <GeoJsonAltitudeProfile mapRef={mapRef} geo={geoBase} />}
        </ContentBox>
    );
};
