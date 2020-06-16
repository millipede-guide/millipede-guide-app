import Paper from '@material-ui/core/Paper';
import { useRef, useEffect } from 'react';
import { ContentBox } from './Typography';
import { pointToLayer, onEachFeature } from '../utils/mapMarkers';

export default ({ center, features }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (features) {
            if (typeof window === 'object' && typeof window.L === 'object') {
                if (mapRef.current === null) {
                    const osmBaseLayer = window.L.tileLayer(
                        `https://${process.env.osmHost}/{z}/{x}/{y}.png`,
                        {
                            attribution:
                                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                        },
                    );

                    // https://github.com/Leaflet/Leaflet.markercluster
                    const lGeo = window.L.markerClusterGroup({
                        showCoverageOnHover: false,
                        removeOutsideVisibleBounds: true,
                        animate: false,
                        animateAddingMarkers: false,
                        chunkedLoading: true,
                        zoomToBoundsOnClick: false,
                        iconCreateFunction: (cluster) => {
                            const n = cluster.getChildCount();
                            let w = n.toString().length * 10 + 12;
                            if (w < 24) w = 24;
                            return window.L.divIcon({
                                className: 'mapicon-parent',
                                html: `<div class="mapicon mapicon-cluster">${n}</div>`,
                                iconSize: [w, 24],
                                iconAnchor: [w / 2, 12],
                            });
                        },
                    });

                    lGeo.on('clusterclick', (e) => {
                        e.layer.zoomToBounds({ padding: [20, 20], animate: true });
                    });

                    const lMap = window.L.map('mapContainer', {
                        center,
                        zoom: 4,
                        scrollWheelZoom: true,
                        fullscreenControl: {
                            pseudoFullscreen: true,
                        },
                        layers: [osmBaseLayer, lGeo],
                    });

                    mapRef.current = { lMap, lGeo };
                }

                mapRef.current.lGeo.clearLayers();

                if (features.length > 0) {
                    const geo = window.L.geoJSON(
                        {
                            type: 'FeatureCollection',
                            features,
                        },
                        {
                            pointToLayer,
                            onEachFeature,
                        },
                    ).addTo(mapRef.current.lGeo);

                    mapRef.current.lMap.fitBounds(geo.getBounds(), {
                        animate: false,
                        padding: [20, 20],
                    });
                }
            }
        }
    }, [features]);

    return (
        <ContentBox>
            <Paper elevation={1}>
                <div id="mapContainer" style={{ height: '25vh', minHeight: '240px' }} />
            </Paper>
        </ContentBox>
    );
};
