import {
    Autocomplete,
    Box,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    InputLabel,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from '@tanstack/react-form';
import { TextareaAutosize } from '@mui/base';
import { Vehicle, type RepairLog } from '../../api/openapi/backend';
import { useCreateRepairLog, useDeleteRepairLogById, useUpdateRepairLog } from '../../api/queries/repairLogQueryOptions';
import { useNavigate } from '@tanstack/react-router';
import { yupValidator } from '@tanstack/yup-form-adapter';
import { useCallback, useId, useMemo, useState } from 'react';
import yup from '../../yup-config';
import { findVehiclesOptions, useCreateVehicle } from '../../api/queries/vehicleQueryOptions';
import { queryClient } from '../../queryClient';
import { useDebouncedCallback } from 'use-debounce';
import React from 'react';
import { styled } from '@mui/system';
import { blue, grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import { formatCustomerNameAsString, formatVehicleMainDetail } from '../../utils/formatterUtil';
import ErrorMessage from '../common/ErrorMessage';
import FormAction from '../common/FormAction';
import TechnicalInfo from '../common/TechnicalInfo';
import TextInput from '../common/TextInput';
import CustomerInput from '../common/CustomerInput';
import { useCreateCustomer } from '../../api/queries/customerQueryOptions';

const Textarea = styled(TextareaAutosize)(
    () => `
    box-sizing: border-box;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.2;
    padding: 4px 6px;
    border-radius: 4px;
    color: ${grey[900]};
    background: '#fff';
    border: 1px solid ${grey[400]};

    &:focus {
      border-color: ${blue[700]};
      box-shadow: 0 0 0 1px ${blue[700]};
    }

    /* firefox */
    &:focus-visible {
      outline: 0;
    }
  `
);

export type RepairLogDetailProps = {
    repairLog?: RepairLog;
};

const RepairLogDetail: React.FC<RepairLogDetailProps> = ({ repairLog }) => {
    const [readOnly, setReadOnly] = useState(!!repairLog);
    const [newVehicle, setNewVehicle] = useState(false);
    const [newCustomer, setNewCustomer] = useState(false);
    const uniqueId = useId();
    const navigate = useNavigate({ from: '/add' });
    const createCustomerMutation = useCreateCustomer();
    const createVehicleMutation = useCreateVehicle();
    const createRepairLogMutation = useCreateRepairLog();
    const updateRepairLogMutation = useUpdateRepairLog();
    const deleteRepairLogByIdMutation = useDeleteRepairLogById();

    const [loadinVehicles, setLoadingVehicles] = useState(false);
    const [customerOpen, setCustomerOpen] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const repairLogSchema = useMemo(
        () =>
            yup.object({
                content: yup.string().trim().required().max(5000, 'Popis opravy musí mať maximálne 5000 znakov').label('Popis opravy'),
                vehicle: yup
                    .object(
                        newVehicle === false
                            ? {
                                  id: yup.number().required()
                              }
                            : {
                                  registrationPlate: yup.string().trim().required().max(20, 'EČ musí mať maximálne 20 znakov').label('EČ'),
                                  customer: yup
                                      .object(
                                          newCustomer === false
                                              ? {
                                                    id: yup.number().required()
                                                }
                                              : {
                                                    name: yup
                                                        .string()
                                                        .trim()
                                                        .required()
                                                        .max(64, 'Meno musí mať maximálne 64 znakov')
                                                        .label('Meno'),
                                                    surname: yup
                                                        .string()
                                                        .trim()
                                                        .optional()
                                                        .nullable()
                                                        .max(64, 'Priezvisko musí mať maximálne 64 znakov')
                                                        .label('Priezvisko')
                                                }
                                      )
                                      .required()
                                      .label('Zákazník')
                              }
                    )
                    .required()
                    .label('Vozidlo'),
                repairDate: yup.string().trim().required().max(20, 'Dátum opravy musí mať maximálne 20 znakov').label('Dátum opravy')
            }),
        [newCustomer, newVehicle]
    );

    const handleCustomerOpen = () => {
        setCustomerOpen(true);
        (async () => {
            setLoadingVehicles(true);
            const res = await queryClient.fetchQuery(findVehiclesOptions(0, 10, ['registrationPlate,asc', 'brand,asc', 'model,asc'], ''));
            setLoadingVehicles(false);
            setVehicles([...(res.content ?? [])]);
        })();
    };

    const handleCustomerClose = () => {
        setCustomerOpen(false);
        setVehicles([]);
    };

    const debouncedSearch = useDebouncedCallback(async (query: string) => {
        const res = await queryClient.fetchQuery(findVehiclesOptions(0, 10, ['registrationPlate,asc', 'brand,asc', 'model,asc'], query));
        setVehicles([...(res.content ?? [])]);
    }, 1000);

    const form = useForm({
        onSubmit: async ({ value: { vehicle, ...data } }) => {
            if (vehicle !== null) {
                try {
                    let vehicleId: number | null = vehicle.id;
                    let customerId: number | null = vehicle.customer.id;
                    if (newCustomer) {
                        const customer = await createCustomerMutation.mutateAsync({
                            name: vehicle.customer.name,
                            surname: vehicle.customer.surname,
                            mobile: null,
                            email: null
                        });
                        customerId = customer.id;
                    }
                    if (newVehicle) {
                        const savedVehicle = await createVehicleMutation.mutateAsync({
                            customerId: customerId,
                            batteryCapacity: null,
                            brand: null,
                            engineCode: null,
                            enginePower: null,
                            engineVolume: null,
                            fuelType: null,
                            model: null,
                            registrationPlate: vehicle.registrationPlate,
                            vin: null,
                            yearOfManufacture: null
                        });
                        vehicleId = savedVehicle.id;
                    }
                    let saved: RepairLog;
                    if (repairLog !== undefined) {
                        saved = await updateRepairLogMutation.mutateAsync({
                            id: repairLog.id,
                            repairLog: { ...data, vehicleId }
                        });
                    } else {
                        saved = await createRepairLogMutation.mutateAsync({ ...data, vehicleId });
                    }
                    setReadOnly(true);
                    navigate({
                        to: '/$id',
                        params: {
                            id: `${saved.id}`
                        }
                    });
                } catch (e) {
                    console.log('Nastala chyba', e);
                }
            }
        },
        validators: {
            onChange: repairLogSchema
        },
        defaultValues: {
            content: repairLog?.content ?? '',
            vehicle: repairLog?.vehicle ?? null,
            repairDate: repairLog?.repairDate ?? ''
        },
        validatorAdapter: yupValidator()
    });

    const handleRepairLogDelete = useCallback(() => {
        if (repairLog !== undefined) {
            deleteRepairLogByIdMutation.mutate(repairLog.id, {
                onSuccess: () => {
                    navigate({
                        to: '/',
                        search: {
                            page: 0,
                            size: 10
                        }
                    });
                }
            });
        }
    }, [repairLog, deleteRepairLogByIdMutation, navigate]);

    return (
        <Box
            component='form'
            display='flex'
            flexDirection='column'
            gap={2}
            noValidate
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            marginBottom={8}
        >
            <Typography
                variant='h5'
                component='div'
                overflow='hidden'
                textOverflow='ellipsis'
            >
                {repairLog !== undefined ? formatVehicleMainDetail(repairLog.vehicle, true) : 'Nový záznam'}
            </Typography>
            <ErrorMessage
                mutationResult={[createRepairLogMutation, updateRepairLogMutation]}
                yupSchema={repairLogSchema}
            />
            {!repairLog && readOnly === false && (
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newVehicle}
                                onChange={() => {
                                    if (newVehicle === false) {
                                        setNewVehicle(true);
                                    } else {
                                        setNewVehicle(false);
                                        setNewCustomer(false);
                                    }
                                }}
                            />
                        }
                        label='Vytvoriť nové vozidlo?'
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newCustomer}
                                onChange={() => {
                                    if (newCustomer === false) {
                                        setNewCustomer(true);
                                        setNewVehicle(true);
                                    } else {
                                        setNewCustomer(false);
                                    }
                                }}
                            />
                        }
                        label='Vytvoriť nového zákazníka?'
                    />
                </FormGroup>
            )}
            <form.Field
                name='vehicle'
                children={({ state, handleChange, handleBlur }) => {
                    return (
                        <Autocomplete
                            sx={{ display: newVehicle === false ? 'initial' : 'none' }}
                            disablePortal
                            open={customerOpen}
                            filterOptions={(x) => x}
                            options={vehicles}
                            loading={loadinVehicles}
                            onOpen={handleCustomerOpen}
                            onClose={handleCustomerClose}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={(o) => o.registrationPlate + ' - ' + formatCustomerNameAsString(o.customer)}
                            onChange={(e, val) => handleChange(val)}
                            value={state.value}
                            onBlur={handleBlur}
                            autoHighlight
                            readOnly={readOnly}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Vozidlo'
                                    onChange={(e) => debouncedSearch(e.target.value)}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loadinVehicles ? (
                                                        <CircularProgress
                                                            color='inherit'
                                                            size={20}
                                                        />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            )
                                        }
                                    }}
                                    required
                                    error={state.meta.isTouched && state.meta.errors.length > 0}
                                    helperText={state.meta.isTouched && state.meta.errors.join(';')}
                                />
                            )}
                        />
                    );
                }}
            />

            <CustomerInput
                name='vehicle.customer'
                label='Zákazník'
                required
                readOnly={readOnly}
                form={form}
                sx={{ display: newVehicle === true && newCustomer === false ? 'initial' : 'none' }}
            />

            <TextInput
                name='vehicle.customer.name'
                label='Meno'
                form={form}
                readOnly={readOnly}
                required
                sx={{ display: newVehicle === true && newCustomer === true ? 'initial' : 'none' }}
            />
            <TextInput
                name='vehicle.customer.surname'
                label='Priezvisko'
                form={form}
                readOnly={readOnly}
                sx={{ display: newVehicle === true && newCustomer === true ? 'initial' : 'none' }}
            />

            <TextInput
                name='vehicle.registrationPlate'
                label='Evidenčné číslo'
                form={form}
                readOnly={readOnly}
                required
                sx={{ display: newVehicle === true ? 'initial' : 'none' }}
            />

            <form.Field
                name='content'
                children={({ state, handleChange, handleBlur }) => {
                    return (
                        <FormControl>
                            <InputLabel
                                htmlFor={`${uniqueId}_content`}
                                shrink={true}
                                sx={{ background: '#fff', paddingX: '4px' }}
                                error={state.meta.isTouched && state.meta.errors.length > 0}
                                required
                            >
                                Popis opravy
                            </InputLabel>
                            <Textarea
                                id={`${uniqueId}_content`}
                                aria-describedby={`${uniqueId}_content-helper`}
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                minRows={6}
                                required
                                sx={
                                    state.meta.isTouched && state.meta.errors.length > 0
                                        ? [
                                              {
                                                  '&:focus': {
                                                      boxShadow: '0 0 0 1px #d32f2f',
                                                      borderColor: '#d32f2f'
                                                  }
                                              },
                                              {
                                                  borderColor: '#d32f2f'
                                              }
                                          ]
                                        : undefined
                                }
                                readOnly={readOnly}
                            />
                            <FormHelperText
                                error={state.meta.isTouched && state.meta.errors.length > 0}
                                id={`${uniqueId}_content-helper`}
                            >
                                {state.meta.isTouched && state.meta.errors.join(';')}
                            </FormHelperText>
                        </FormControl>
                    );
                }}
            />
            <form.Field
                name='repairDate'
                children={({ state, handleChange }) => {
                    return (
                        <FormControl>
                            <DatePicker
                                value={state.value ? dayjs(state.value) : null}
                                onChange={(e) => {
                                    if (e !== null) {
                                        const iso = e.format('YYYY-MM-DD');
                                        handleChange(iso);
                                    }
                                }}
                                format='DD.MM.YYYY'
                                label='Dátum opravy *'
                                aria-describedby={`${uniqueId}_repairDate-helper`}
                                readOnly={readOnly}
                            />
                            <FormHelperText
                                error={state.meta.isTouched && state.meta.errors.length > 0}
                                id={`${uniqueId}_repairDate-helper`}
                            >
                                {state.meta.isTouched && state.meta.errors.join(';')}
                            </FormHelperText>
                        </FormControl>
                    );
                }}
            />
            <Stack
                direction={{
                    sx: 'column',
                    sm: 'row'
                }}
                gap={2}
                justifyContent='space-between'
            >
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => {
                        return (
                            <FormAction
                                canSubmit={canSubmit}
                                isPending={isSubmitting || deleteRepairLogByIdMutation.isPending}
                                onBackHandler={() =>
                                    navigate({
                                        to: '/',
                                        search: {
                                            page: 0,
                                            size: 10
                                        }
                                    })
                                }
                                onDeleteHandler={handleRepairLogDelete}
                                setReadOnly={(v) => setReadOnly(v)}
                                readOnly={readOnly}
                                allowDelete={repairLog !== undefined}
                                deleteModal={{
                                    title: 'Naozaj vymazať záznam opravy?',
                                    body: 'Po potvrdení dôjde k odstráneniu záznamu opravy!'
                                }}
                            />
                        );
                    }}
                </form.Subscribe>
            </Stack>
            {repairLog && <TechnicalInfo object={repairLog} />}
        </Box>
    );
};

export default RepairLogDetail;
