import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Box, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { Customer, Vehicle, type RepairLog } from '../../api/openapi/backend';
import { useCreateRepairLog, useDeleteRepairLogById, useUpdateRepairLog } from '../../api/queries/repairLogQueryOptions';
import { useCreateVehicle } from '../../api/queries/vehicleQueryOptions';
import { useCreateCustomer } from '../../api/queries/customerQueryOptions';
import { useUploadAttachment } from '../../api/queries/attachmentQueryOptions';
import yup from '../../yup-config';
import { formatVehicleMainDetail } from '../../utils/formatterUtil';
import { isNotBlankString } from '../../utils/typeGuardUtil';
import ErrorMessage from '../common/ErrorMessage';
import FormAction from '../common/FormAction';
import TechnicalInfo from '../common/TechnicalInfo';
import TextInput from '../common/TextInput';
import CustomerInput from '../common/CustomerInput';
import VehicleInput from '../common/VehicleInput';
import DateInput from '../common/DateInput';
import TextareaInput from '../common/TextareaInput';
import FileInput from '../common/FileInput';
import Attachments from './Attachments';

export type RepairLogDetailProps = {
    repairLog?: RepairLog;
};

type FormType = Pick<RepairLog, 'content' | 'repairDate' | 'odometer'> & {
    vehicle: null | Pick<Vehicle, 'id'>;
    customer: null | Pick<Customer, 'id'>;
    name: string | null;
    surname: string | null;
    registrationPlate: string | null;
    newVehicle: boolean;
    newCustomer: boolean;
};

const repairLogSchema = yup.object({
    newVehicle: yup.boolean().defined().default(false),
    newCustomer: yup.boolean().defined().default(false),
    content: yup.string().defined().trim().required().max(5000, 'Popis opravy musí mať maximálne 5000 znakov').label('Popis opravy'),
    vehicle: yup
        .object({
            id: yup.number().defined().required()
        })
        .defined()
        .nullable()
        .when(['newVehicle'], {
            is: true,
            then: (schema) => schema.transform(() => null),
            otherwise: (schema) => schema.required()
        })
        .label('Vozidlo'),
    customer: yup
        .object({
            id: yup.number().nonNullable().required().required()
        })
        .defined()
        .nullable()
        .when(['newVehicle', 'newCustomer'], {
            is: (newVehicle: boolean, newCustomer: boolean) => newVehicle === true && newCustomer === false,
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.nullable().transform(() => null)
        })
        .label('Zákazník'),
    name: yup
        .string()
        .defined()
        .nullable()
        .when(['newCustomer'], {
            is: true,
            then: (schema) => schema.trim().required().max(64, 'Meno musí mať maximálne 64 znakov'),
            otherwise: (schema) => schema.transform(() => null)
        })
        .label('Meno'),
    surname: yup
        .string()
        .defined()
        .nullable()
        .when(['newCustomer'], {
            is: true,
            then: (schema) => schema.trim().max(64, 'Priezvisko musí mať maximálne 64 znakov'),
            otherwise: (schema) => schema.transform(() => null)
        })
        .label('Priezvisko'),
    registrationPlate: yup
        .string()
        .defined()
        .nullable()
        .when(['newVehicle'], {
            is: true,
            then: (schema) => schema.trim().required().max(20, 'EČ musí mať maximálne 20 znakov'),
            otherwise: (schema) => schema.transform(() => null)
        })
        .label('EČ'),
    odometer: yup
        .number()
        .typeError('Stav odometra musí byť číslo v jednotkách km')
        .integer()
        .defined()
        .min(0)
        .max(99999999)
        .emptyAsNull()
        .nullable()
        .label('Stav odometra (km)'),
    repairDate: yup.string().trim().required().max(20, 'Dátum opravy musí mať maximálne 20 znakov').label('Dátum opravy')
});

const RepairLogDetail: React.FC<RepairLogDetailProps> = ({ repairLog }) => {
    const router = useRouter();
    const [readOnly, setReadOnly] = useState(!!repairLog);
    const navigate = useNavigate();
    const createCustomerMutation = useCreateCustomer();
    const createVehicleMutation = useCreateVehicle();
    const createRepairLogMutation = useCreateRepairLog();
    const updateRepairLogMutation = useUpdateRepairLog();
    const deleteRepairLogByIdMutation = useDeleteRepairLogById();
    const uploadAttachmentMutation = useUploadAttachment();
    const [files, setFiles] = useState<File[]>([]);

    const methods = useForm<FormType>({
        resolver: yupResolver(repairLogSchema, {
            stripUnknown: true // Remove non used attributes
        }),
        defaultValues: {
            newCustomer: false,
            newVehicle: false,
            content: repairLog?.content ?? '',
            vehicle: repairLog?.vehicle ?? null,
            customer: null,
            registrationPlate: '',
            name: '',
            surname: '',
            repairDate: repairLog?.repairDate ?? '',
            odometer: repairLog?.odometer ?? null
        }
    });

    const {
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { isLoading, isSubmitting, isValidating, isSubmitted, isValid }
    } = methods;

    const onSubmit = handleSubmit(
        async ({ newCustomer, newVehicle, vehicle, customer, content, name, surname, registrationPlate, ...rest }) => {
            try {
                let vehicleId: number | null = vehicle?.id ?? null;
                let customerId: number | null = customer?.id ?? null;
                if (newCustomer && isNotBlankString(name)) {
                    const savedCustomer = await createCustomerMutation.mutateAsync({
                        name: name.trim(),
                        surname: surname?.trim() ?? null,
                        mobile: null,
                        email: null
                    });
                    customerId = savedCustomer.id;
                }
                if (newVehicle && isNotBlankString(registrationPlate) && customerId !== null) {
                    const savedVehicle = await createVehicleMutation.mutateAsync({
                        customerId: customerId,
                        batteryCapacity: null,
                        brand: null,
                        engineCode: null,
                        enginePower: null,
                        engineVolume: null,
                        fuelType: null,
                        model: null,
                        registrationPlate: registrationPlate.trim(),
                        vin: null,
                        yearOfManufacture: null
                    });
                    vehicleId = savedVehicle.id;
                }
                if (vehicleId !== null) {
                    let saved: RepairLog;
                    if (repairLog !== undefined) {
                        saved = await updateRepairLogMutation.mutateAsync({
                            id: repairLog.id,
                            repairLog: { content: content.trim(), vehicleId, ...rest }
                        });
                    } else {
                        saved = await createRepairLogMutation.mutateAsync({ content: content.trim(), vehicleId, ...rest });
                    }
                    if (files !== null) {
                        for (const file of files) {
                            if (file.size < window.ENV.MAX_ATTACHMENT_SIZE) {
                                await uploadAttachmentMutation.mutateAsync({ repairLogId: saved.id, multipartFile: file });
                            }
                        }
                    }
                    setFiles([]);
                    setReadOnly(true);
                    router.invalidate();
                    reset({
                        newCustomer: false,
                        newVehicle: false,
                        content: saved.content ?? '',
                        vehicle: saved.vehicle ?? null,
                        customer: null,
                        registrationPlate: '',
                        name: '',
                        surname: '',
                        repairDate: saved.repairDate ?? '',
                        odometer: saved.odometer ?? null
                    });
                    navigate({
                        to: '/$id',
                        params: {
                            id: `${saved.id}`
                        }
                    });
                }
            } catch (e) {
                console.log('Nastala chyba', e);
            }
        }
    );

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

    const isPending = isLoading || isSubmitting || isValidating;
    const canSubmit = (isSubmitted && isValid) || !isSubmitted;

    const [newVehicle, newCustomer] = watch(['newVehicle', 'newCustomer']);

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
                    data-cy='log-title'
                >
                    {repairLog !== undefined ? formatVehicleMainDetail(repairLog.vehicle, true) : 'Nový záznam'}
                </Typography>
                <ErrorMessage
                    mutationResult={[
                        createRepairLogMutation,
                        updateRepairLogMutation,
                        uploadAttachmentMutation,
                        createCustomerMutation,
                        createVehicleMutation
                    ]}
                    yupSchema={repairLogSchema}
                />
                {!repairLog && readOnly === false && (
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newVehicle}
                                    onChange={() => {
                                        setValue('customer', null);
                                        setValue('vehicle', null);
                                        setValue('registrationPlate', '');
                                        if (newVehicle === false) {
                                            setValue('newVehicle', true);
                                        } else {
                                            setValue('name', null);
                                            setValue('surname', '');
                                            setValue('newVehicle', false);
                                            setValue('newCustomer', false);
                                        }
                                    }}
                                    data-cy='new-vehicle-checkbox'
                                />
                            }
                            label='Vytvoriť nové vozidlo?'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newCustomer}
                                    onChange={() => {
                                        setValue('customer', null);
                                        setValue('name', null);
                                        setValue('surname', '');
                                        if (newCustomer === false) {
                                            setValue('newCustomer', true);
                                            if (newVehicle === false) {
                                                setValue('vehicle', null);
                                                setValue('registrationPlate', '');
                                                setValue('newVehicle', true);
                                            }
                                        } else {
                                            setValue('newCustomer', false);
                                        }
                                    }}
                                    data-cy='new-customer-checkbox'
                                />
                            }
                            label='Vytvoriť nového zákazníka?'
                        />
                    </FormGroup>
                )}
                <VehicleInput
                    name='vehicle'
                    label='Vozidlo'
                    required
                    readOnly={readOnly}
                    sx={{ display: newVehicle === false ? 'initial' : 'none' }}
                />
                <CustomerInput
                    name='customer'
                    label='Zákazník'
                    required
                    readOnly={readOnly}
                    sx={{ display: newVehicle === true && newCustomer === false ? 'initial' : 'none' }}
                />
                <TextInput
                    name='name'
                    label='Meno'
                    readOnly={readOnly}
                    required
                    sx={{ display: newCustomer === true ? 'initial' : 'none' }}
                    data-cy={'name-input'}
                />
                <TextInput
                    name='surname'
                    label='Priezvisko'
                    readOnly={readOnly}
                    sx={{ display: newCustomer === true ? 'initial' : 'none' }}
                    data-cy={'surname-input'}
                />
                <TextInput
                    name='registrationPlate'
                    label='Evidenčné číslo'
                    readOnly={readOnly}
                    required
                    sx={{ display: newVehicle === true ? 'initial' : 'none' }}
                    style={{
                        textTransform: 'uppercase'
                    }}
                    data-cy={'registration-plate-input'}
                />
                <TextareaInput
                    name='content'
                    label='Popis opravy'
                    readOnly={readOnly}
                    required
                    data-cy={'content-textarea'}
                />
                <TextInput
                    name='odometer'
                    label='Stav odometra (km)'
                    readOnly={readOnly}
                    data-cy={'odometer-input'}
                />
                <DateInput
                    readOnly={readOnly}
                    required
                    name='repairDate'
                    label='Dátum opravy'
                    data-cy={'repair-date-input'}
                />
                {readOnly === false && (
                    <FileInput
                        label='Pridať prílohy'
                        files={files}
                        setFiles={setFiles}
                    />
                )}
                {repairLog && (
                    <Attachments
                        attachments={repairLog.attachments}
                        readOnly={readOnly}
                    />
                )}
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
                        isPending={isPending || deleteRepairLogByIdMutation.isPending}
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
                        setReadOnly={(v) => {
                            if (v === true) {
                                reset();
                                setFiles([]);
                            }
                            setReadOnly(v);
                        }}
                        readOnly={readOnly}
                        allowDelete={repairLog !== undefined}
                        deleteModal={{
                            title: 'Naozaj vymazať záznam opravy?',
                            body: 'Po potvrdení dôjde k odstráneniu záznamu opravy!'
                        }}
                    />
                </Stack>
                {repairLog && readOnly && <TechnicalInfo object={repairLog} />}
            </Box>
        </FormProvider>
    );
};

export default RepairLogDetail;
