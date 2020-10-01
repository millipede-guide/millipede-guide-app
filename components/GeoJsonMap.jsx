/* global process URL */

import Paper from '@material-ui/core/Paper';
import { useRef, useEffect, useCallback } from 'react';

export default function GeoJsonMap({ geo, callback, onEachFeature, pointToLayer }) {
    const lMap = useRef();
    const markerClusterGroup = useRef();

    const drawMap = useCallback((container) => {
        if (
            container !== null &&
            typeof window === 'object' &&
            typeof window.L === 'object' &&
            !lMap.current
        ) {
            const osmBaseLayer = window.L.tileLayer(
                `https://${new URL(process.env.OSM_HOST).host}/{z}/{x}/{y}.png`,
                {
                    attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                },
            );

            const thuderforestBaseLayer = window.L.tileLayer(
                `https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=${process.env.TF_API_KEY}`,
                {
                    attribution:
                        '<a href="https://www.thunderforest.com/maps/landscape/">thunderforest.com</a>',
                },
            );

            const baseLayers = {
                Streetmap: osmBaseLayer,
                Landscape: thuderforestBaseLayer,
            };

            const featureLayers = {};

            markerClusterGroup.current = window.L.markerClusterGroup({
                showCoverageOnHover: false,
                removeOutsideVisibleBounds: true,
                animate: false,
                animateAddingMarkers: false,
                chunkedLoading: true,
                zoomToBoundsOnClick: true,
            });

            markerClusterGroup.current.on('clusterclick', (e) => {
                e.layer.zoomToBounds({ padding: [20, 20], animate: true });
            });

            window.L.layerGroup();

            featureLayers['<span class="mdi mdi-map-marker-path"></span> Base'] =
                markerClusterGroup.current;

            lMap.current = window.L.map(container, {
                center: [0, 0],
                zoom: 1,
                scrollWheelZoom: true,
                fullscreenControl: {
                    pseudoFullscreen: true,
                },
                layers: [osmBaseLayer, ...Object.values(featureLayers)],
            });

            lMap.current.currentFeatureLayers = featureLayers;

            lMap.current.currentLayersControl = window.L.control
                .layers(baseLayers, featureLayers, { autoZIndex: false, hideSingleBase: true })
                .addTo(lMap.current);

            if (callback) {
                callback(lMap.current);
            }
        }
    }, []);

    useEffect(() => {
        if (
            typeof window === 'object' &&
            typeof window.L === 'object' &&
            markerClusterGroup.current
        ) {
            markerClusterGroup.current.clearLayers();

            if (geo && geo.type && geo.type === 'FeatureCollection' && geo.features.length > 0) {
                const geoLayer = window.L.geoJSON(geo, {
                    pointToLayer:
                        pointToLayer ||
                        ((feature, latlng) => {
                            return window.L.circleMarker(latlng, {
                                radius: 8,
                                weight: 5,
                                color: '#00f',
                                opacity: 0.2,
                                fill: true,
                                fillOpacity: 1,
                            });
                        }),
                    style: {
                        fillOpacity: 0.6,
                    },
                    onEachFeature:
                        onEachFeature ||
                        (({ properties }, featureLayer) => {
                            if (properties.title && properties.url) {
                                featureLayer.bindPopup(
                                    () =>
                                        `<a href="${properties.url}">
                                    ${properties.date ? `${properties.date}<br>` : ''}
                                    ${properties.title}
                                    ${
                                        properties.image
                                            ? `<br /><img src="${properties.image}" />`
                                            : ''
                                    }
                                 </a>`,
                                    {
                                        autoPan: true,
                                        autoPanPadding: [40, 10],
                                        closeButton: false,
                                        closeOnEscapeKey: true,
                                        closeOnClick: true,
                                        minWidth: 160,
                                        minHeight: 160,
                                    },
                                );
                            }
                        }),
                });

                markerClusterGroup.current.addLayer(geoLayer);

                if (lMap.current) {
                    lMap.current.fitBounds(geoLayer.getBounds(), {
                        animate: true,
                        padding: [20, 20],
                    });
                }
            }
        }
    }, [geo, markerClusterGroup.current]);

    // Note, minHeight must be bigger than marker icon popup balloon.
    return <Paper ref={drawMap} elevation={1} style={{ height: '25vh', minHeight: '220px' }} />;
}
