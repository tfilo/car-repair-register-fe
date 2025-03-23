import React, { useCallback, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { VehicleCreate, type Vehicle } from '../../api/openapi/backend';
import { useCreateVehicle, useDeleteVehicleById, useUpdateVehicle } from '../../api/queries/vehicleQueryOptions';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatCustomerNameAsString } from '../../utils/formatterUtil';
import yup from '../../yup-config';
import ErrorMessage from '../common/ErrorMessage';
import FormAction from '../common/FormAction';
import TextInput from '../common/TextInput';
import TechnicalInfo from '../common/TechnicalInfo';
import NavBtn from '../common/NavBtn';
import { Person } from '@mui/icons-material';
import CustomerInput from '../common/CustomerInput';
import { FormProvider, useForm } from 'react-hook-form';

type FormType = Omit<VehicleCreate, 'customerId'> & {
    customer: {
        id: number;
    };
};

const vehicleSchema = yup.object({
    registrationPlate: yup.string().trim().required().max(20, 'EČ musí mať maximálne 20 znakov').label('EČ'),
    customer: yup
        .object({
            id: yup
                .number()
                .transform((value) => {
                    if (isNaN(value)) {
                        return null;
                    }
                    return value;
                })
                .nonNullable()
                .required()
                .label('Zákazník')
        })
        .required()
        .label('Zákazník'),
    vin: yup.string().trim().defined().emptyAsNull().nullable().max(20, 'VIN musí mať maximálne 20 znakov').label('VIN'),
    engineCode: yup
        .string()
        .trim()
        .defined()
        .emptyAsNull()
        .nullable()
        .max(20, 'Kód motora musí mať maximálne 20 znakov')
        .label('Kód motora'),
    fuelType: yup.string().trim().defined().emptyAsNull().nullable().max(20, 'Typ paliva musí mať maximálne 20 znakov').label('Typ paliva'),
    enginePower: yup
        .number()
        .typeError('Výkon motora musí byť číslo v jednotkách kW')
        .integer()
        .defined()
        .min(0)
        .max(3000)
        .emptyAsNull()
        .nullable()
        .label('Výkon motora'),
    engineVolume: yup
        .number()
        .typeError('Objem motora musí byť číslo v jednotkách ccm')
        .integer()
        .defined()
        .min(0)
        .max(10000)
        .emptyAsNull()
        .nullable()
        .label('Objem motora'),
    batteryCapacity: yup
        .number()
        .typeError('Kapacita batérie musí byť číslo v jednotkách kWh')
        .integer()
        .defined()
        .min(0)
        .max(1000)
        .emptyAsNull()
        .nullable()
        .label('Kapacita batérie'),
    brand: yup
        .string()
        .trim()
        .defined()
        .defined()
        .emptyAsNull()
        .nullable()
        .max(64, 'Výrobca musí mať maximálne 64 znakov')
        .label('Výrobca'),
    model: yup.string().trim().defined().emptyAsNull().nullable().max(64, 'Model musí mať maximálne 64 znakov').label('Model'),
    yearOfManufacture: yup
        .number()
        .typeError('Rok výroby musí byť číslo')
        .integer()
        .defined()
        .min(1900)
        .max(2100)
        .emptyAsNull()
        .nullable()
        .label('Rok výroby')
});

export type VehicleDetailProps = {
    vehicle?: Vehicle;
};

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle }) => {
    const router = useRouter();
    const [readOnly, setReadOnly] = useState(!!vehicle);
    const navigate = useNavigate();
    const createVehicleMutation = useCreateVehicle();
    const updateVehicleMutation = useUpdateVehicle();
    const deleteVehicleByIdMutation = useDeleteVehicleById();

    const methods = useForm<FormType>({
        resolver: yupResolver(vehicleSchema, {
            stripUnknown: true // Remove non used attributes
        }),
        defaultValues: {
            customer: vehicle?.customer ?? { id: NaN },
            registrationPlate: vehicle?.registrationPlate ?? '',
            vin: vehicle?.vin ?? '',
            engineCode: vehicle?.engineCode ?? '',
            fuelType: vehicle?.fuelType ?? '',
            enginePower: vehicle?.enginePower ?? null,
            engineVolume: vehicle?.engineVolume ?? null,
            batteryCapacity: vehicle?.batteryCapacity ?? null,
            brand: vehicle?.brand ?? '',
            model: vehicle?.model ?? '',
            yearOfManufacture: vehicle?.yearOfManufacture ?? null
        }
    });

    const {
        handleSubmit,
        reset,
        formState: { isLoading, isSubmitting, isValidating, isSubmitted, isValid }
    } = methods;

    const onSubmit = handleSubmit(async ({ customer, ...data }) => {
        if (customer !== null) {
            try {
                let saved: Vehicle;
                if (vehicle !== undefined) {
                    saved = await updateVehicleMutation.mutateAsync({ id: vehicle.id, vehicle: { ...data, customerId: customer.id } });
                } else {
                    saved = await createVehicleMutation.mutateAsync({ ...data, customerId: customer.id });
                }
                setReadOnly(true);
                router.invalidate();
                reset({
                    customer: saved.customer,
                    registrationPlate: saved.registrationPlate ?? '',
                    vin: saved.vin ?? '',
                    engineCode: saved.engineCode ?? '',
                    fuelType: saved.fuelType ?? '',
                    enginePower: saved.enginePower,
                    engineVolume: saved.engineVolume,
                    batteryCapacity: saved.batteryCapacity,
                    brand: saved.brand ?? '',
                    model: saved.model ?? '',
                    yearOfManufacture: saved.yearOfManufacture
                });
                navigate({
                    to: '/vehicle/$id',
                    params: {
                        id: `${saved.id}`
                    }
                });
            } catch (e) {
                console.log('Nastala chyba', e);
            }
        }
    });

    const handleVehicleDelete = useCallback(() => {
        if (vehicle !== undefined) {
            deleteVehicleByIdMutation.mutate(vehicle.id, {
                onSuccess: () => {
                    navigate({
                        to: '/vehicle',
                        search: {
                            page: 0,
                            size: 10
                        }
                    });
                }
            });
        }
    }, [vehicle, deleteVehicleByIdMutation, navigate]);

    const isPending = isLoading || isSubmitting || isValidating;
    const canSubmit = (isSubmitted && isValid) || !isSubmitted;

    return (
        <FormProvider {...methods}>
            <Box
                component='form'
                display='flex'
                flexDirection='column'
                gap={2}
                noValidate
                onSubmit={onSubmit}
                autoComplete='off'
                marginBottom={8}
            >
                <Typography
                    variant='h5'
                    component='div'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    data-cy='vehicle-title'
                >
                    {vehicle !== undefined ? vehicle.registrationPlate : 'Nové vozidlo'}
                </Typography>
                <ErrorMessage
                    mutationResult={[createVehicleMutation, updateVehicleMutation]}
                    yupSchema={vehicleSchema}
                />
                <Box
                    display='flex'
                    flexDirection='row'
                    justifyItems={'start'}
                >
                    <CustomerInput
                        name='customer'
                        label='Zákazník'
                        required
                        readOnly={readOnly}
                    />
                    {vehicle && readOnly && (
                        <NavBtn
                            title={`Zobraziť zákaznika ${formatCustomerNameAsString(vehicle.customer)}`}
                            onClick={() =>
                                navigate({
                                    to: '/customer/$id',
                                    params: {
                                        id: `${vehicle.customer.id}`
                                    }
                                })
                            }
                        >
                            <Person fontSize='inherit' />
                        </NavBtn>
                    )}
                </Box>
                <TextInput
                    name='registrationPlate'
                    label='Evidenčné číslo'
                    readOnly={readOnly}
                    required
                    style={{
                        textTransform: 'uppercase'
                    }}
                    data-cy={'registration-plate-input'}
                />
                <TextInput
                    name='vin'
                    label='VIN'
                    readOnly={readOnly}
                    style={{
                        textTransform: 'uppercase'
                    }}
                    data-cy='vin-input'
                />
                <TextInput
                    name='engineCode'
                    label='Kód motora'
                    readOnly={readOnly}
                    style={{
                        textTransform: 'uppercase'
                    }}
                    data-cy='engine-code-input'
                />
                <TextInput
                    name='yearOfManufacture'
                    label='Rok výroby'
                    readOnly={readOnly}
                    data-cy='year-of-manufacture-input'
                />
                <TextInput
                    name='brand'
                    label='Výrobca'
                    readOnly={readOnly}
                    data-cy='brand-input'
                />
                <TextInput
                    name='model'
                    label='Model'
                    readOnly={readOnly}
                    data-cy='model-input'
                />
                <TextInput
                    name='fuelType'
                    label='Typ paliva'
                    readOnly={readOnly}
                    data-cy='fuel-type-input'
                />
                <TextInput
                    name='enginePower'
                    label='Výkon motora (kW)'
                    readOnly={readOnly}
                    data-cy='engine-power-input'
                />
                <TextInput
                    name='engineVolume'
                    label='Objem motora (ccm)'
                    readOnly={readOnly}
                    data-cy='engine-volume-input'
                />
                <TextInput
                    name='batteryCapacity'
                    label='Kapacita batérie (kWh)'
                    readOnly={readOnly}
                    data-cy='battery-capacity-input'
                />
                <Stack
                    direction={{
                        sx: 'column',
                        sm: 'row'
                    }}
                    gap={2}
                    justifyContent='space-between'
                >
                    <FormAction
                        canSubmit={canSubmit}
                        isPending={isPending || deleteVehicleByIdMutation.isPending}
                        onBackHandler={() =>
                            navigate({
                                to: '/vehicle',
                                search: {
                                    page: 0,
                                    size: 10
                                }
                            })
                        }
                        onDeleteHandler={handleVehicleDelete}
                        setReadOnly={(v) => {
                            if (v === true && vehicle !== undefined) {
                                reset({
                                    batteryCapacity: vehicle.batteryCapacity,
                                    brand: vehicle.brand ?? '',
                                    customer: vehicle.customer,
                                    engineCode: vehicle.engineCode ?? '',
                                    enginePower: vehicle.enginePower,
                                    engineVolume: vehicle.engineVolume,
                                    fuelType: vehicle.fuelType ?? '',
                                    model: vehicle.model ?? '',
                                    registrationPlate: vehicle.registrationPlate ?? '',
                                    vin: vehicle.vin ?? '',
                                    yearOfManufacture: vehicle.yearOfManufacture
                                });
                            }
                            setReadOnly(v);
                        }}
                        readOnly={readOnly}
                        allowDelete={vehicle !== undefined}
                        deleteModal={{
                            title: 'Naozaj vymazať vozidlo vrátane všetkých záznamov?',
                            body: 'Po potvrdení dôjde k odstráneniu vozidla, vrátane jeho záznamov o opravách!'
                        }}
                    />
                </Stack>
                {vehicle && readOnly && <TechnicalInfo object={vehicle} />}
            </Box>
        </FormProvider>
    );
};

export default VehicleDetail;
