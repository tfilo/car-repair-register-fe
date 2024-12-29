import { Box, Stack, Typography } from '@mui/material';
import { type Vehicle } from '../../api/openapi/backend';
import { useForm } from '@tanstack/react-form';
import { useCreateVehicle, useDeleteVehicleById, useUpdateVehicle } from '../../api/queries/vehicleQueryOptions';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { formatCustomerNameAsString } from '../../utils/formatterUtil';
import React from 'react';
import yup from '../../yup-config';
import { yupValidator } from '@tanstack/yup-form-adapter';
import ErrorMessage from '../common/ErrorMessage';
import FormAction from '../common/FormAction';
import TextInput from '../common/TextInput';
import TechnicalInfo from '../common/TechnicalInfo';
import NavBtn from '../common/NavBtn';
import { Person } from '@mui/icons-material';
import CustomerInput from '../common/CustomerInput';

const vehicleSchema = yup.object({
    registrationPlate: yup.string().trim().required().max(20, 'EČ musí mať maximálne 20 znakov').label('EČ'),
    customer: yup
        .object({
            id: yup.number().required()
        })
        .required()
        .label('Zákazník'),
    vin: yup.string().trim().optional().nullable().max(20, 'VIN musí mať maximálne 20 znakov').label('VIN'),
    engineCode: yup.string().trim().optional().nullable().max(20, 'Kód motora musí mať maximálne 20 znakov').label('Kód motora'),
    fuelType: yup.string().trim().optional().nullable().max(20, 'Typ paliva musí mať maximálne 20 znakov').label('Typ paliva'),
    enginePower: yup
        .number()
        .typeError('Výkon motora musí byť číslo v jednotkách kW')
        .integer()
        .min(0)
        .max(3000)
        .nullable()
        .default(null)
        .label('Výkon motora'),
    engineVolume: yup
        .number()
        .typeError('Objem motora musí byť číslo v jednotkách ccm')
        .integer()
        .min(0)
        .max(10000)
        .nullable()
        .default(null)
        .label('Objem motora'),
    batteryCapacity: yup
        .number()
        .typeError('Kapacita batérie musí byť číslo v jednotkách kWh')
        .integer()
        .min(0)
        .max(1000)
        .nullable()
        .default(null)
        .label('Kapacita batérie'),

    brand: yup.string().trim().optional().nullable().max(64, 'Výrobca musí mať maximálne 64 znakov').label('Výrobca'),
    model: yup.string().trim().optional().nullable().max(64, 'Model musí mať maximálne 64 znakov').label('Model'),
    yearOfManufacture: yup
        .number()
        .typeError('Rok výroby musí byť číslo')
        .integer()
        .min(1900)
        .max(2100)
        .nullable()
        .default(null)
        .label('Rok výroby')
});

export type VehicleDetailProps = {
    vehicle?: Vehicle;
};

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle }) => {
    const [readOnly, setReadOnly] = useState(!!vehicle);
    const navigate = useNavigate({ from: '/vehicle/add' });
    const createVehicleMutation = useCreateVehicle();
    const updateVehicleMutation = useUpdateVehicle();
    const deleteVehicleByIdMutation = useDeleteVehicleById();

    const form = useForm({
        onSubmit: async ({ value: { customer, ...data } }) => {
            if (customer !== null) {
                try {
                    let saved: Vehicle;
                    if (vehicle !== undefined) {
                        saved = await updateVehicleMutation.mutateAsync({ id: vehicle.id, vehicle: { ...data, customerId: customer.id } });
                    } else {
                        saved = await createVehicleMutation.mutateAsync({ ...data, customerId: customer.id });
                    }
                    setReadOnly(true);
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
        },
        validators: {
            onChange: vehicleSchema
        },
        defaultValues: {
            customer: vehicle?.customer ?? null,
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
        },
        validatorAdapter: yupValidator()
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
                    form={form}
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
                form={form}
                readOnly={readOnly}
                required
            />
            <TextInput
                name='vin'
                label='VIN'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='engineCode'
                label='Kód motora'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='yearOfManufacture'
                label='Rok výroby'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='brand'
                label='Výrobca'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='model'
                label='Model'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='fuelType'
                label='Typ paliva'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='enginePower'
                label='Výkon motora (kW)'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='engineVolume'
                label='Objem motora (ccm)'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='batteryCapacity'
                label='Kapacita batérie (kWh)'
                form={form}
                readOnly={readOnly}
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
                                isPending={isSubmitting || deleteVehicleByIdMutation.isPending}
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
                                setReadOnly={(v) => setReadOnly(v)}
                                readOnly={readOnly}
                                allowDelete={vehicle !== undefined}
                                deleteModal={{
                                    title: 'Naozaj vymazať vozidlo vrátane všetkých záznamov?',
                                    body: 'Po potvrdení dôjde k odstráneniu vozidla, vrátane jeho záznamov o opravách!'
                                }}
                            />
                        );
                    }}
                </form.Subscribe>
            </Stack>
            {vehicle && readOnly && <TechnicalInfo object={vehicle} />}
        </Box>
    );
};

export default VehicleDetail;
