import humanize from 'underscore.string/humanize';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
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
import Earth from 'mdi-material-ui/Earth';
import Reload from 'mdi-material-ui/Reload';
import Wave from 'mdi-material-ui/Wave';
import Waves from 'mdi-material-ui/Waves';
import Binoculars from 'mdi-material-ui/Binoculars';
// import TableFurniture from 'mdi-material-ui/TableFurniture';
import Grid from '@material-ui/core/Grid';
import { H2, ContentBox, ContentInner } from './Typography';

const iconMap = {
    bicycles: Bicycle,
    mountain_bike: Bicycle,
    road_bicycle: BicycleBasket,
    booking_required: CalendarMultiselect,
    dogs: DogSide,
    firearms: Pistol,
    campfires: Campfire,
    generators: PowerPlug,
    hikers_only: Walk,
    horses: Horseshoe,
    pets: DogSide,
    tree_fall_risk: Tree,
    beach: Beach,
    toilet: Toilet,
    water: WaterPump,
    showers: ShowerHead,
    drive_in: CarEstate,
    allocated_sites: Numeric,
    smoking: Smoking,
    amplified_music: Speaker,
    rubbish_bins: TrashCan,
    accessible: WheelchairAccessibility,
    stairs: Stairs,
    rainforest: Leaf,
    mountainous: Terrain,
    walk: Walk,
    stroller: BabyCarriage,
    slippery: ShoePrint,
    reload: Reload,
    canyon: Wave,
    flood_risk: Waves,
    water_crossing: Waves,
    tidal_water_crossing: Waves,
    stepping_stones_water_crossing: Waves,
    lookout: Binoculars,
    loop: Reload,
    unesco_world_heritage: Earth,
    // tables: TableFurniture,
};

const icon = i => {
    const Icon = i in iconMap ? iconMap[i] : Information;
    return <Icon />;
};

export default ({ doc }) => {
    const { features } = doc;

    const sort = (ka, kb) => {
        const a = features[ka];
        const b = features[kb];
        return (a && !b && -1) || (!a && b && 1) || a > b;
    };

    const info = () => {
        // TO DO
    };

    return (
        <>
            {'features' in doc && (
                <>
                    <ContentBox>
                        <H2>Features</H2>
                        <ContentInner>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={1}
                            >
                                {Object.keys(features)
                                    .sort(sort)
                                    .map(i => (
                                        <Grid item key={i}>
                                            <Chip
                                                icon={icon(i)}
                                                label={humanize((features[i] ? '' : 'No ') + i)}
                                                color={features[i] ? 'primary' : 'default'}
                                                deleteIcon={
                                                    features[i] ? <DoneIcon /> : <ClearIcon />
                                                }
                                                onDelete={info}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </ContentInner>
                    </ContentBox>
                </>
            )}
        </>
    );
};
