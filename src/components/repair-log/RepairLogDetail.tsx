import { Box, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { type RepairLog } from '../../api/openapi/backend';
import { useCreateRepairLog, useDeleteRepairLogById, useUpdateRepairLog } from '../../api/queries/repairLogQueryOptions';
import { useNavigate } from '@tanstack/react-router';
import { yupValidator } from '@tanstack/yup-form-adapter';
import { useCallback, useMemo, useState } from 'react';
import yup from '../../yup-config';
import { useCreateVehicle } from '../../api/queries/vehicleQueryOptions';
import React from 'react';
import { formatVehicleMainDetail } from '../../utils/formatterUtil';
import ErrorMessage from '../common/ErrorMessage';
import FormAction from '../common/FormAction';
import TechnicalInfo from '../common/TechnicalInfo';
import TextInput from '../common/TextInput';
import CustomerInput from '../common/CustomerInput';
import { useCreateCustomer } from '../../api/queries/customerQueryOptions';
import VehicleInput from '../common/VehicleInput';
import DateInput from '../common/DateInput';
import TextareaInput from '../common/TextareaInput';
import FileInput from '../common/FileInput';
import { useUploadAttachment } from '../../api/queries/attachmentQueryOptions';
import { MAX_FILE_SIZE } from '../../utils/constants';
import Attachments from './Attachments';

export type RepairLogDetailProps = {
    repairLog?: RepairLog;
};

const RepairLogDetail: React.FC<RepairLogDetailProps> = ({ repairLog }) => {
    const [readOnly, setReadOnly] = useState(!!repairLog);
    const [newVehicle, setNewVehicle] = useState(false);
    const [newCustomer, setNewCustomer] = useState(false);
    const navigate = useNavigate({ from: '/add' });
    const createCustomerMutation = useCreateCustomer();
    const createVehicleMutation = useCreateVehicle();
    const createRepairLogMutation = useCreateRepairLog();
    const updateRepairLogMutation = useUpdateRepairLog();
    const deleteRepairLogByIdMutation = useDeleteRepairLogById();
    const uploadAttachmentMutation = useUploadAttachment();
    const [files, setFiles] = useState<FileList | null>(null);

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

                    if (files !== null) {
                        for (let i = 0; i < files.length; i++) {
                            if (files[i].size < MAX_FILE_SIZE) {
                                await uploadAttachmentMutation.mutateAsync({ repairLogId: saved.id, multipartFile: files[i] });
                            }
                        }
                    }
                    setFiles(null);
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
                mutationResult={[createRepairLogMutation, updateRepairLogMutation, uploadAttachmentMutation]}
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
            <VehicleInput
                name='vehicle'
                label='Vozidlo'
                required
                readOnly={readOnly}
                form={form}
                sx={{ display: newVehicle === false ? 'initial' : 'none' }}
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
            <TextareaInput
                name='content'
                label='Popis opravy'
                form={form}
                readOnly={readOnly}
                required
            />
            <DateInput
                form={form}
                readOnly={readOnly}
                required
                name='repairDate'
                label='Dátum opravy'
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
            {repairLog && readOnly && <TechnicalInfo object={repairLog} />}
        </Box>
    );
};

export default RepairLogDetail;
