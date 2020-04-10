import humanize from 'underscore.string/humanize';
import truncate from 'underscore.string/truncate';
import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
import Bicycle from 'mdi-material-ui/Bicycle';
import Walk from 'mdi-material-ui/Walk';
import DogSide from 'mdi-material-ui/DogSide';
import Horseshoe from 'mdi-material-ui/Horseshoe';
import Pistol from 'mdi-material-ui/Pistol';
import Campfire from 'mdi-material-ui/Campfire';
import Tree from 'mdi-material-ui/Tree';
import CalendarMultiselect from 'mdi-material-ui/CalendarMultiselect';
import Beach from 'mdi-material-ui/Beach';
import Toilet from 'mdi-material-ui/Toilet';
import WaterPump from 'mdi-material-ui/WaterPump';
import Information from 'mdi-material-ui/Information';
import ShowerHead from 'mdi-material-ui/ShowerHead';
import CarEstate from 'mdi-material-ui/CarEstate';
import Numeric from 'mdi-material-ui/Numeric';
import Smoking from 'mdi-material-ui/Smoking';
import PowerPlug from 'mdi-material-ui/PowerPlug';
import Speaker from 'mdi-material-ui/Speaker';
import TrashCan from 'mdi-material-ui/TrashCan';
import WheelchairAccessibility from 'mdi-material-ui/WheelchairAccessibility';
import Stairs from 'mdi-material-ui/Stairs';
import Leaf from 'mdi-material-ui/Leaf';
import Terrain from 'mdi-material-ui/Terrain';
import BabyCarriage from 'mdi-material-ui/BabyCarriage';
import BicycleBasket from 'mdi-material-ui/BicycleBasket';
import ShoePrint from 'mdi-material-ui/ShoePrint';
import AlertIcon from 'mdi-material-ui/Alert';
import Earth from 'mdi-material-ui/Earth';
import Reload from 'mdi-material-ui/Reload';
import Wave from 'mdi-material-ui/Wave';
import Waves from 'mdi-material-ui/Waves';
import GrillIcon from 'mdi-material-ui/Grill';
import Binoculars from 'mdi-material-ui/Binoculars';
// import TableFurniture from 'mdi-material-ui/TableFurniture';
import Grid from '@material-ui/core/Grid';
import CarHatchback from 'mdi-material-ui/CarHatchback';
import Motorbike from 'mdi-material-ui/Motorbike';
import Caravan from 'mdi-material-ui/Caravan';
import RvTruck from 'mdi-material-ui/RvTruck';
import SailBoat from 'mdi-material-ui/Ferry';
import BusStopIcon from 'mdi-material-ui/BusStop';
import RoadVariant from 'mdi-material-ui/RoadVariant';
import CarTractionControl from 'mdi-material-ui/CarTractionControl';
import { H2, ContentBox, ContentInner } from './Typography';

const iconMap = {
    bbq: GrillIcon,
    '4x4': CarEstate,
    wheelchair: WheelchairAccessibility,
    allocated_campsites: Numeric,
    amplified_music: Speaker,
    beach: Beach,
    bicycles: Bicycle,
    boat: SailBoat,
    booking_required: CalendarMultiselect,
    campfires: Campfire,
    canyon: Wave,
    public_transport: BusStopIcon,
    car: CarHatchback,
    caravan: Caravan,
    causeway: Waves,
    cliff_edges: AlertIcon,
    dogs: DogSide,
    drive_in_campsites: CarEstate,
    firearms: Pistol,
    flood_risk: Waves,
    generators: PowerPlug,
    hike_in: Walk,
    hikers_only: Walk,
    horses: Horseshoe,
    kayak: SailBoat,
    lookout: Binoculars,
    loop: Reload,
    motorcycle: Motorbike,
    motorhome: RvTruck,
    mountain_bike: Bicycle,
    mountainous: Terrain,
    mountain_peak: Terrain,
    pets: DogSide,
    rainforest: Leaf,
    reload: Reload,
    road_bicycle: BicycleBasket,
    rubbish_bins: TrashCan,
    sealed_road: RoadVariant,
    showers: ShowerHead,
    slippery: ShoePrint,
    smoking: Smoking,
    stairs: Stairs,
    stepping_stones_water_crossing: Waves,
    stroller: BabyCarriage,
    tidal_water_crossing: Waves,
    toilet: Toilet,
    tree_fall_risk: Tree,
    gathering_firewood: Tree,
    unesco_world_heritage: Earth,
    walk: Walk,
    short_walk: Walk,
    water: WaterPump,
    water_crossing: Waves,
    windy_road: CarTractionControl,
    waterfall: Binoculars,
    // tables: TableFurniture,
};

export default ({ heading, features }) => {
    const icon = i => {
        const Icon = i in iconMap ? iconMap[i] : Information;
        if (features[i]) {
            return <Icon />;
        }
        return (
            <Badge badgeContent="&times;" overlap="circle">
                <Icon />
            </Badge>
        );
    };

    const chips = items =>
        items.map(i => (
            <Grid item key={`${i}${features[i]}`}>
                <Chip
                    variant="outlined"
                    icon={icon(i)}
                    label={truncate(humanize(i), 22)}
                    title={humanize(i)}
                    disabled={!features[i]}
                    style={features[i] ? null : { textDecoration: 'line-through' }}
                />
            </Grid>
        ));

    return (
        <>
            {features !== undefined && Object.keys(features).length > 0 && (
                <ContentBox>
                    <H2>{heading}</H2>
                    <ContentInner>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                        >
                            {chips(Object.keys(features).filter(i => features[i]))}
                            {chips(Object.keys(features).filter(i => !features[i]))}
                        </Grid>
                    </ContentInner>
                </ContentBox>
            )}
        </>
    );
};
