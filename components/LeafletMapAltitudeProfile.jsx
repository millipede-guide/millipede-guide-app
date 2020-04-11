import L from 'leaflet';
import { useEffect, useState } from 'react';
import Chart from 'chart.js';
import 'chartjs-plugin-datalabels';
import prettyMetric from 'pretty-metric';
import AltitudeProfileContainer from './AltitudeProfileContainer';

Chart.defaults.global.elements.line.borderColor = '#558b2f88';
// Chart.defaults.global.elements.line.backgroundColor = '#558b2f55';
Chart.defaults.global.elements.line.backgroundColor = '#00000011';
Chart.defaults.global.animation.duration = 0;

export default ({ lmap, geo }) => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        if (
            lmap !== null &&
            geo !== null &&
            typeof geo === 'object' &&
            geo.type === 'FeatureCollection'
        ) {
            const altitudeMarker = L.marker([0, 0], {
                icon: L.divIcon({
                    className: 'mapicon-altitude',
                    iconSize: [6, 6],
                    iconAnchor: [3, 3],
                }),
            }).addTo(lmap);

            const lineString = geo.features.filter(
                f => f.type === 'Feature' && f.geometry && f.geometry.type === 'LineString',
            )[0];

            if (lineString !== undefined) {
                let dist = 0;
                let prevPoint = null;
                let prevAlt = null;
                let asc = 0;
                let desc = 0;
                let gain = 0;
                let loss = 0;

                const altitudeProfile = lineString.geometry.coordinates
                    .map(([lng, lat, alt]) => {
                        const ll = L.latLng(lat, lng, alt);
                        if (prevPoint) {
                            const step = prevPoint.distanceTo(ll);
                            if (step < 20) return null;
                            dist += step;
                            if (alt > prevAlt) {
                                gain += alt - prevAlt;
                                asc += step;
                            } else {
                                loss += prevAlt - alt;
                                desc += step;
                            }
                        }
                        prevAlt = alt;
                        prevPoint = ll;
                        return {
                            x: Math.round(dist),
                            y: alt,
                            latlng: ll,
                        };
                    })
                    .filter(i => i !== null);

                const altMax = altitudeProfile.reduce((val, obj) => (obj.y > val ? obj.y : val), 0);
                const altMin = altitudeProfile.reduce(
                    (val, obj) => (obj.y < val ? obj.y : val),
                    altMax,
                );

                const median = ary =>
                    ary.length === 0 ? -1 : ary[Math.floor((ary.length - 1) / 2)];

                const altMaxIndex = median(
                    altitudeProfile.map((obj, i) => (obj.y === altMax ? i : -1)).filter(i => i > 0),
                );
                const altMinIndex = median(
                    altitudeProfile.map((obj, i) => (obj.y === altMin ? i : -1)).filter(i => i > 0),
                );

                const rounder = val => {
                    if (val > 10000) return Math.round(val / 1000) * 1000;
                    if (val > 1000) return Math.round(val / 100) * 100;
                    if (val > 100) return Math.round(val / 10) * 10;
                    return val;
                };

                const stepSize = () => {
                    if (dist > 15000) return 10000;
                    if (dist > 1500) return 1000;
                    if (dist > 150) return 100;
                    if (dist > 15) return 10;
                    return 1;
                };

                setStats({
                    dist: prettyMetric(rounder(dist)).humanize(),
                    asc: prettyMetric(rounder(asc)).humanize(),
                    gain: prettyMetric(rounder(gain)).humanize(),
                    desc: prettyMetric(rounder(desc)).humanize(),
                    loss: prettyMetric(rounder(loss)).humanize(),
                });

                const altitudeProfileContainer = document.getElementById('altitudeProfile');

                /* eslint-disable no-new */
                new Chart(altitudeProfileContainer, {
                    type: 'scatter',
                    data: {
                        datasets: [
                            {
                                data: altitudeProfile,
                                showLine: true,
                                radius: 0,
                            },
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                        },
                        events: ['click'],
                        tooltips: {
                            mode: 'nearest',
                            intersect: false,
                            axis: 'x',
                            displayColors: false,
                            callbacks: {
                                label: item => {
                                    const { x, y, latlng } = altitudeProfile[item.index];
                                    const label = `${prettyMetric(x).humanize()} (altitude ${y}m)`;
                                    lmap.panTo(latlng, {
                                        animate: true,
                                        duration: 1,
                                    });
                                    altitudeMarker.unbindTooltip();
                                    altitudeMarker.setLatLng(latlng);
                                    altitudeMarker.bindTooltip(label, {
                                        permanent: true,
                                        offset: [0, 0],
                                    });
                                    return label;
                                },
                            },
                        },
                        scales: {
                            yAxes: [
                                {
                                    display: false,
                                    ticks: {
                                        min: altMin < 100 ? 0 : altMin - 100,
                                        max: altMax + 10,
                                    },
                                },
                            ],
                            xAxes: [
                                {
                                    gridLines: {
                                        display: false,
                                        drawTicks: false,
                                    },
                                    ticks: {
                                        display: false,
                                        beginAtZero: true,
                                        min: 0,
                                        max: dist,
                                        stepSize: stepSize(),
                                        callback: value => {
                                            // return '';
                                            if (value === 0) return ''; // dist > 1000 ? '0km' : '0m';
                                            if (value === dist) return '';
                                            return prettyMetric(rounder(value)).humanize();
                                        },
                                    },
                                },
                            ],
                        },
                        plugins: {
                            datalabels: {
                                clip: false,
                                offset: 0,
                                align: context => {
                                    const i = context.dataIndex;
                                    const p = context.dataset.data[i];
                                    return p.y === altMax ? 'end' : 'start';
                                },
                                font: {
                                    weight: 600,
                                },
                                display: context =>
                                    context.dataIndex === altMinIndex ||
                                    (context.dataIndex === altMaxIndex &&
                                        altMinIndex !== altMaxIndex),
                                formatter: p => `${rounder(p.y)}m`,
                            },
                        },
                        layout: {
                            padding: {
                                top: 20,
                                right: 0,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                });
                /* eslint-enable no-new */
            }
        }
    }, [lmap, geo]);

    return <AltitudeProfileContainer stats={stats} />;
};
