import { AddCircle, DirectionsCar } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { findVehiclesOptions } from '../../api/queries/vehicleQueryOptions';
import { formatCustomerName, formatVehicleMainDetail, formatVehicleSecondaryDetail } from '../../utils/formatterUtil';
import NavBtn from '../common/NavBtn';
import CommonSearch from '../common/CommonSearch';
import { useCallback } from 'react';
import { Vehicle } from '../../api/openapi/backend';

const ActionBar: React.FC = () => {
    const navigate = useNavigate({ from: '/' });

    return (
        <NavBtn
            title='Pridať vozidlo'
            onClick={() => navigate({ to: '/vehicle/add' })}
        >
            <AddCircle fontSize='inherit' />
        </NavBtn>
    );
};

const Primary: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    return (
        <>
            <Box
                overflow='hidden'
                textOverflow='ellipsis'
            >
                {formatVehicleMainDetail(vehicle, true)}
            </Box>
            <Typography
                overflow='hidden'
                textOverflow='ellipsis'
                variant='body2'
                color='info'
            >
                {formatCustomerName(vehicle.customer)}
            </Typography>
        </>
    );
};

const Secondary: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    return (
        <Box
            overflow='hidden'
            textOverflow='ellipsis'
            component='span'
        >
            <span>{formatVehicleSecondaryDetail(vehicle)}</span>
        </Box>
    );
};

const Vehicles: React.FC = () => {
    const navigate = useNavigate({ from: '/vehicle' });
    const { page, size, sort, query, customerId } = useSearch({ from: '/vehicle/' });
    const findVehicles = useSuspenseQuery(findVehiclesOptions(page, size, sort, query, customerId));

    const navigationHandler = useCallback(
        (id: number) => {
            return () =>
                navigate({
                    to: '/vehicle/$id',
                    params: {
                        id: `${id}`
                    }
                });
        },
        [navigate]
    );

    return (
        <CommonSearch
            result={findVehicles.data}
            searchHelper='Vyhľadáva podľa EČ, VIN, výrobcu, modelu a zákazníka.'
            query={query}
            actionBar={<ActionBar />}
        >
            {(vehicle) => ({
                Icon: DirectionsCar,
                onClick: navigationHandler(vehicle.id),
                primary: <Primary vehicle={vehicle} />,
                secondary: <Secondary vehicle={vehicle} />
            })}
        </CommonSearch>
    );
};

export default Vehicles;
