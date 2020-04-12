import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { useRef, useState, useEffect } from 'react';
import Control from '@skyeer/react-leaflet-custom-control';
import MapExpandIcon from 'mdi-material-ui/ArrowExpandAll';
import MapShrinkIcon from 'mdi-material-ui/ArrowCollapseAll';
import LeafletMapContainer from './LeafletMapContainer';
import AltitudeProfile from './LeafletMapAltitudeProfile';
import Link from './Link';
import photoIndex from '../public/photos/index.json';

export default ({ center, markers, category, geoJsonUrl, showAltitudeProfile }) => {
    const mapRef = useRef(null);

    const [geo, setGeo] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const boundsOptions = { animate: true, padding: [10, 10] };
    const setBounds = bounds => {
        if (bounds && mapRef.current && mapRef.current.leafletElement) {
            mapRef.current.leafletElement.fitBounds(bounds, boundsOptions);
        }
    };

    useEffect(() => {
        setBounds(
            markers && markers.length !== 0 ? L.latLngBounds(markers.map(i => i.location)) : null,
        );
    }, [markers]);

    useEffect(() => {
        if (geoJsonUrl) {
            window.fetch(geoJsonUrl).then(response => {
                response.json().then(data => setGeo(data));
            });
        }
    }, []);

    useEffect(() => {
        if (mapRef.current && mapRef.current.leafletElement) {
            if (expanded) {
                mapRef.current.container.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'center',
                });
            }
            mapRef.current.leafletElement.invalidateSize();
        }
    }, [expanded]);

    const setZoom = () => {
        if (mapRef.current && mapRef.current.leafletElement) {
            const zoom = mapRef.current.leafletElement.getZoom();
            let scale = zoom / 18;
            if (scale < 0.7) scale = 0.7;
            document.getElementById('mapIconStyle').innerHTML = `.mapicon { transform: scale(${
                scale > 1 ? 1 : scale
            }); }`;
        }
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const mdiIconMap = {
        bus: 'bus',
        campsite: 'tent',
        marker: 'map-marker',
        parking: 'parking',
        photo: 'camera',
        shelter: 'home-variant',
        toilets: 'human-male-female',
        toilets_f: 'human-female',
        toilets_m: 'human-male',
        train: 'train',
        water: 'water-pump',
    };

    const mapIcon = type =>
        L.divIcon({
            className: 'mapicon-parent',
            html: `<div class="mapicon mapicon-${type} mdi mdi-${mdiIconMap[type]}"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });

    const pointToLayer = (feature, latlng) => {
        return L.featureGroup([
            L.marker(latlng, {
                icon: mapIcon(feature.properties.type),
            }),
        ]);
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
                    // TODO: attribution
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

    return (
        <>
            <LeafletMapContainer>
                <Map
                    ref={mapRef}
                    center={center}
                    zoom={4}
                    animate
                    style={{ height: expanded ? '75vh' : '25vh' }}
                    onZoomEnd={() => setZoom()}
                >
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.millipede-guide.com/{z}/{x}/{y}.png"
                    />
                    <Control position="topleft">
                        <button
                            type="button"
                            onClick={toggleExpand}
                            style={{
                                border: '2px solid rgba(0,0,0,0.2)',
                                backgroundClip: 'padding-box',
                                backgroundColor: '#fff',
                                marginLeft: '1px',
                                marginBottom: '2px',
                                borderRadius: '4px',
                                padding: '4px 4px 2px 4px',
                            }}
                        >
                            {expanded ? (
                                <MapShrinkIcon fontSize="small" />
                            ) : (
                                <MapExpandIcon fontSize="small" />
                            )}
                        </button>
                    </Control>
                    {markers &&
                        markers.map(i => (
                            <Marker key={i.id} position={i.location} icon={mapIcon('marker')}>
                                <Popup>
                                    <Link href={`/${category}/[id]`} as={`/${category}/${i.id}/`}>
                                        <div style={{ textAlign: 'center', width: '200px' }}>
                                            {i.photos.length >= 1 && (
                                                <div
                                                    className="MuiCardMedia-root"
                                                    style={{
                                                        height: '140px',
                                                        marginBottom: '5px',
                                                        backgroundImage: `url("/photos/sm/${
                                                            photoIndex[i.photos[0].src].hash
                                                        }.jpg")`,
                                                    }}
                                                />
                                            )}
                                            <strong>{i.name}</strong>
                                        </div>
                                    </Link>
                                </Popup>
                            </Marker>
                        ))}
                    {geo && (
                        <GeoJSON
                            data={geo}
                            onEachFeature={onEachFeature}
                            pointToLayer={pointToLayer}
                            onAdd={e => setBounds(e.target.getBounds())}
                        />
                    )}
                </Map>
            </LeafletMapContainer>
            {showAltitudeProfile && <AltitudeProfile mapRef={mapRef} geo={geo} />}
            <style id="mapIconStyle" />
        </>
    );
};
