import { Box, ButtonGroup, Typography } from '@mui/material';
import { CarRepair, DirectionsCar, Person } from '@mui/icons-material';
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';
import { formatCustomerName } from '../../utils/formatterUtil';
import dayjs from 'dayjs';
import NavBtn from '../common/NavBtn';
import CommonSearch from '../common/CommonSearch';
import React, { useCallback } from 'react';
import { type RepairLog } from '../../api/openapi/backend';

const ActionBar: React.FC = () => {
    const navigate = useNavigate({ from: '/' });

    return (
        <ButtonGroup
            variant='outlined'
            sx={{ justifyContent: 'end', display: 'flex' }}
        >
            <NavBtn
                onClick={() => navigate({ to: '/add' })}
                title='Pridať záznam opravy'
            >
                <CarRepair fontSize='inherit' />
            </NavBtn>
            <NavBtn
                title='Zákazníci'
                onClick={() =>
                    navigate({
                        to: '/customer',
                        search: {
                            page: 0,
                            size: 10,
                            query: '',
                            sort: ['name,asc', 'surname,asc']
                        }
                    })
                }
            >
                <Person fontSize='inherit' />
            </NavBtn>
            <NavBtn
                title='Vozidlá'
                onClick={() =>
                    navigate({
                        to: '/vehicle',
                        search: {
                            page: 0,
                            size: 10
                        }
                    })
                }
            >
                <DirectionsCar fontSize='inherit' />
            </NavBtn>
        </ButtonGroup>
    );
};

const Primary: React.FC<{ repairLog: RepairLog }> = ({ repairLog }) => {
    return (
        <>
            <Box
                display='flex'
                justifyContent='space-between'
                overflow='hidden'
                textOverflow='ellipsis'
            >
                {repairLog.vehicle.registrationPlate}
                <Typography color='textSecondary'>{dayjs(repairLog.repairDate).format('DD.MM.YYYY')}</Typography>
            </Box>
            <Typography
                overflow='hidden'
                textOverflow='ellipsis'
                variant='body2'
                color='info'
            >
                {formatCustomerName(repairLog.vehicle.customer)}
            </Typography>
            {repairLog.odometer !== null && (
                <Typography
                    overflow='hidden'
                    textOverflow='ellipsis'
                    variant='body2'
                    color='info'
                >
                    Stav odometra: {repairLog.odometer.toLocaleString('sk')}km
                </Typography>
            )}
            {repairLog.attachments && repairLog.attachments.length > 0 && (
                <Typography
                    overflow='hidden'
                    textOverflow='ellipsis'
                    variant='body2'
                    color='secondary'
                >
                    Počet príloh: {repairLog.attachments.length}ks
                </Typography>
            )}
        </>
    );
};

const Secondary: React.FC<{ repairLog: RepairLog }> = ({ repairLog }) => {
    return (
        <Box
            overflow='hidden'
            textOverflow='ellipsis'
            component='span'
            whiteSpace='pre-line'
        >
            {repairLog.content}
        </Box>
    );
};

const RepairLogs: React.FC = () => {
    const navigate = useNavigate({ from: '/' });
    const { query } = useSearch({ from: '/' });
    const findRepairLogs = useLoaderData({
        from: '/'
    });

    const navigationHandler = useCallback(
        (id: number) => {
            return () =>
                navigate({
                    to: '/$id',
                    params: {
                        id: `${id}`
                    }
                });
        },
        [navigate]
    );

    return (
        <CommonSearch
            result={findRepairLogs}
            searchHelper='Vyhľadáva podľa obsahu textu, EČ, VIN, výrobcu, modelu a zákazníka.'
            query={query}
            actionBar={<ActionBar />}
        >
            {(repairLog) => ({
                Icon: DirectionsCar,
                onClick: navigationHandler(repairLog.id),
                primary: <Primary repairLog={repairLog} />,
                secondary: <Secondary repairLog={repairLog} />
            })}
        </CommonSearch>
    );
};

export default RepairLogs;
