import Paper from '@material-ui/core/Paper';
import { useRef, useState, useEffect } from 'react';
import humanize from 'underscore.string/humanize';
import { ContentBox } from './Typography';
import GeoJsonAltitudeProfile from './GeoJsonAltitudeProfile';

export default ({ center, geoJsonUrl, showAltitudeProfile }) => {
    const mapRef = useRef(null);
    const [geo, setGeo] = useState(null);

    const markerTypes = ['marker', 'toilets', 'water', 'shelter', 'transport', 'parking', 'photo'];

    const markerIcons = {
        marker: 'map-marker',
        parking: 'parking',
        photo: 'camera',
        shelter: 'home-variant',
        toilets: 'human-male-female',
        transport: 'bus',
        water: 'water-pump',
    };

    const mapIcon = type =>
          window.L.divIcon({
              className: 'mapicon-parent',
              html: `<div class="mapicon mapicon-${type} mdi mdi-${markerIcons[type]}"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
          });

    const pointToLayer = (feature, latlng) => {
        const t = feature.properties.type;
        return window.L.marker(latlng, {
            icon: mapIcon(t),
            title: humanize(t),
            alt: humanize(t),
            zIndexOffset: 1000 + (markerTypes.length - markerTypes.indexOf(t)) * 10,
            riseOnHover: true,
        });
    };

    const onEachFeature = (feature, featureLayer) => {
        featureLayer.bindPopup(
            () => {
                const props = feature.properties;
                const html = [];
                if ('name' in props && props.name) {
                    html.push(`<div><strong>${props.name}</strong></div>`);
                }
                if ('photo' in props && props.photo) {
                    html.push(
                        `<div class='MuiCardMedia-root' style='width: 216px; height: 140px; background-image: url("${props.photo.src}")'></div>`,
                    );
                }
                return html.join('');
            },
            {
                autoPan: true,
                closeButton: true,
                closeOnEscapeKey: true,
                closeOnClick: true,
            },
        );
    };

    const setDynamicStyle = zoom => {
        let scale = zoom / 18;
        if (scale < 0.6) scale = 0.6;
        document.getElementById('mapDynamicStyle').innerHTML = `.mapicon { transform: scale(${
            scale > 1 ? 1 : scale
        }); }`;
    };

    useEffect(() => {
        if (typeof window === 'object' && typeof window.L === 'object') {
            if (geoJsonUrl) {
                window.fetch(geoJsonUrl).then(response => {
                    response.json().then(data => setGeo(data));
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

                const markerLayers = {};

                const lines = geo.features.filter(f => f.geometry.type === 'LineString');

                if (lines.length > 0) {
                    markerLayers[
                        `<span class="mdi mdi-vector-polyline"><span/> Track`
                    ] = window.L.geoJSON(
                        {
                            type: 'FeatureCollection',
                            features: lines,
                        },
                        {
                            pointToLayer,
                            onEachFeature,
                        },
                    );
                }

                markerTypes.forEach(t => {
                    const points = geo.features.filter(
                        f => f.geometry.type === 'Point' && f.properties && f.properties.type === t,
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
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: 'topleft',
                        forceSeparateButton: true,
                        forcePseudoFullscreen: true,
                    },
                    layers: [osmBaseLayer, ...Object.values(markerLayers)],
                });

                lMap.on('enterFullscreen', () => {
                    window.setTimeout(() => lMap.invalidateSize(), 100);
                });
                
                lMap.on('exitFullscreen', () => {
                    window.setTimeout(() => lMap.invalidateSize(), 100);
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
                <div id="mapContainer" style={{ height: '25vh' }} />
            </Paper>
            <style id="mapDynamicStyle" />
            {showAltitudeProfile && <GeoJsonAltitudeProfile mapRef={mapRef} geo={geo} />}
        </ContentBox>
    );
};
