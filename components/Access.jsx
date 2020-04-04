import humanize from 'underscore.string/humanize';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import Bike from 'mdi-material-ui/Bike';
import Walk from 'mdi-material-ui/Walk';
import CarHatchback from 'mdi-material-ui/CarHatchback';
import CarEstate from 'mdi-material-ui/CarEstate';
import Motorbike from 'mdi-material-ui/Motorbike';
import Caravan from 'mdi-material-ui/Caravan';
import RvTruck from 'mdi-material-ui/RvTruck';
import BicycleBasket from 'mdi-material-ui/BicycleBasket';
import SailBoat from 'mdi-material-ui/Ferry';
import RoadVariant from 'mdi-material-ui/RoadVariant';
import Waves from 'mdi-material-ui/Waves';
import ArrowRightDropCircle from 'mdi-material-ui/ArrowRightDropCircle';
import CarTractionControl from 'mdi-material-ui/CarTractionControl';
import Grid from '@material-ui/core/Grid';
import { H2, ContentBox, ContentInner } from './Typography';

const iconMap = {
    '4x4': CarEstate,
    car: CarHatchback,
    caravan: Caravan,
    hike_in: Walk,
    motorcycle: Motorbike,
    motorhome: RvTruck,
    mountain_bike: Bike,
    road_bicycle: BicycleBasket,
    boat: SailBoat,
    kayak: SailBoat,
    sealed_road: RoadVariant,
    causeway: Waves,
    windy_road: CarTractionControl,
};

const icon = i => {
    const Icon = i in iconMap ? iconMap[i] : ArrowRightDropCircle;
    return <Icon />;
};

export default ({ doc }) => {
    const { access } = doc;

    const sort = (ka, kb) => {
        const a = access[ka];
        const b = access[kb];
        return (a && !b && -1) || (!a && b && 1) || a > b;
    };

    const info = () => {
        // TO DO
    };

    if ('access' in doc) {
        return (
            <>
                <ContentBox>
                    <H2>Access</H2>
                    <ContentInner>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                        >
                            {Object.keys(access)
                                .sort(sort)
                                .map(i => (
                                    <Grid item key={i}>
                                        <Chip
                                            icon={icon(i)}
                                            label={humanize((access[i] ? '' : 'No ') + i)}
                                            color={access[i] ? 'primary' : 'default'}
                                            deleteIcon={access[i] ? <DoneIcon /> : <ClearIcon />}
                                            onDelete={info}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </ContentInner>
                </ContentBox>
            </>
        );
    }
    return <></>;
};
