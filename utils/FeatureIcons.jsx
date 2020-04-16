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
import CarHatchback from 'mdi-material-ui/CarHatchback';
import Motorbike from 'mdi-material-ui/Motorbike';
import Caravan from 'mdi-material-ui/Caravan';
import RvTruck from 'mdi-material-ui/RvTruck';
import SailBoat from 'mdi-material-ui/Ferry';
import TentIcon from 'mdi-material-ui/Tent';
import TrainIcon from 'mdi-material-ui/Train';
import BusStopIcon from 'mdi-material-ui/BusStop';
import RoadVariant from 'mdi-material-ui/RoadVariant';
import CarTractionControl from 'mdi-material-ui/CarTractionControl';

const iconMap = {
    '4x4': CarEstate,
    allocated_campsites: Numeric,
    amplified_music: Speaker,
    bbq: GrillIcon,
    beach: Beach,
    bicycles: Bicycle,
    boat: SailBoat,
    booking_required: CalendarMultiselect,
    campfires: Campfire,
    camping: TentIcon,
    canyon: Wave,
    car: CarHatchback,
    caravan: Caravan,
    causeway: Waves,
    cliff_edges: AlertIcon,
    cycling: Bicycle,
    dogs: DogSide,
    dogs_off_leash: DogSide,
    drive_in_campsites: CarEstate,
    firearms: Pistol,
    flood_risk: Waves,
    gathering_firewood: Tree,
    generators: PowerPlug,
    gravel_track: CarTractionControl,
    hike_in: Walk,
    hikers_only: Walk,
    horses: Horseshoe,
    kayak: SailBoat,
    lookout: Binoculars,
    loop: Reload,
    motorbikes: Motorbike,
    motorcycle: Motorbike,
    motorhome: RvTruck,
    mountain_bike: Bicycle,
    mountain_peak: Terrain,
    mountainous: Terrain,
    pets: DogSide,
    public_transport: BusStopIcon,
    rail_trail: TrainIcon,
    rainforest: Leaf,
    reload: Reload,
    road_bicycle: BicycleBasket,
    rubbish_bins: TrashCan,
    sealed_road: RoadVariant,
    sealed_surface: RoadVariant,
    short_walk: Walk,
    showers: ShowerHead,
    slippery: ShoePrint,
    smoking: Smoking,
    stairs: Stairs,
    stepping_stones_water_crossing: Waves,
    stroller: BabyCarriage,
    tidal_water_crossing: Waves,
    toilet: Toilet,
    tree_fall_risk: Tree,
    unesco_world_heritage: Earth,
    vehicles: CarHatchback,
    walk: Walk,
    walking: Walk,
    water: WaterPump,
    water_crossing: Waves,
    waterfall: Binoculars,
    wheelchair: WheelchairAccessibility,
    windy_road: CarTractionControl,
    // tables: TableFurniture,
};

export default i => {
    const Icon = i in iconMap ? iconMap[i] : Information;
    return <Icon />;
};
