import { Box, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import { useForm, Validator } from '@tanstack/react-form';
import { Customer, Vehicle, type RepairLog } from '../../api/openapi/backend';
import { useCreateRepairLog, useDeleteRepairLogById, useUpdateRepairLog } from '../../api/queries/repairLogQueryOptions';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { yupValidator } from '@tanstack/yup-form-adapter';
import React, { useCallback, useMemo, useState } from 'react';
import yup from '../../yup-config';
import { useCreateVehicle } from '../../api/queries/vehicleQueryOptions';
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
import Attachments from './Attachments';
import { isNotBlankString } from '../../utils/typeGuardUtil';

export type RepairLogDetailProps = {
    repairLog?: RepairLog;
};

type FormType = Omit<RepairLog, 'vehicle' | 'attachments' | 'created' | 'modified' | 'id'> & {
    vehicle:
        | null
        | (Pick<Vehicle, 'registrationPlate' | 'id'> & {
              customer: Pick<Customer, 'name' | 'surname'>;
          });
    customer: null | Pick<Customer, 'name' | 'surname' | 'id'>;
    name: string | null;
    surname: string | null;
    registrationPlate: string | null;
};

const RepairLogDetail: React.FC<RepairLogDetailProps> = ({ repairLog }) => {
    const router = useRouter();
    const [readOnly, setReadOnly] = useState(!!repairLog);
    const [newVehicle, setNewVehicle] = useState(false);
    const [newCustomer, setNewCustomer] = useState(false);
    const navigate = useNavigate();
    const createCustomerMutation = useCreateCustomer();
    const createVehicleMutation = useCreateVehicle();
    const createRepairLogMutation = useCreateRepairLog();
    const updateRepairLogMutation = useUpdateRepairLog();
    const deleteRepairLogByIdMutation = useDeleteRepairLogById();
    const uploadAttachmentMutation = useUploadAttachment();
    const [files, setFiles] = useState<File[]>([]);

    const repairLogSchema = useMemo(
        () =>
            yup.object<FormType>({
                content: yup.string().trim().required().max(5000, 'Popis opravy musí mať maximálne 5000 znakov').label('Popis opravy'),
                vehicle:
                    newVehicle === true
                        ? yup
                              .object()
                              .optional()
                              .nullable()
                              .transform(() => null)
                        : yup
                              .object({
                                  id: yup.number().required()
                              })
                              .required()
                              .label('Vozidlo'),
                customer:
                    newVehicle === true && newCustomer === false
                        ? yup
                              .object({
                                  id: yup.number().required()
                              })
                              .required()
                              .label('Zákazník')
                        : yup
                              .object()
                              .optional()
                              .nullable()
                              .transform(() => null),
                name:
                    newCustomer === true
                        ? yup.string().trim().required().max(64, 'Meno musí mať maximálne 64 znakov').label('Meno')
                        : yup
                              .string()
                              .optional()
                              .nullable()
                              .transform(() => null),
                surname:
                    newCustomer === true
                        ? yup.string().trim().optional().nullable().max(64, 'Priezvisko musí mať maximálne 64 znakov').label('Priezvisko')
                        : yup
                              .string()
                              .optional()
                              .nullable()
                              .transform(() => null),
                registrationPlate:
                    newVehicle === true
                        ? yup.string().trim().required().max(20, 'EČ musí mať maximálne 20 znakov').label('EČ')
                        : yup
                              .string()
                              .optional()
                              .nullable()
                              .transform(() => null),
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
            }),
        [newCustomer, newVehicle]
    );

    const form = useForm<FormType, Validator<unknown, yup.AnySchema>>({
        onSubmit: async ({ value: { vehicle, customer, content, name, surname, registrationPlate, ...rest } }) => {
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
                        files.forEach(async (file) => {
                            if (file.size < window.ENV.MAX_ATTACHMENT_SIZE) {
                                await uploadAttachmentMutation.mutateAsync({ repairLogId: saved.id, multipartFile: file });
                            }
                        });
                    }
                    setFiles([]);
                    setReadOnly(true);
                    router.invalidate();
                    form.reset({
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
        },
        validators: {
            onChange: repairLogSchema
        },
        defaultValues: {
            content: repairLog?.content ?? '',
            vehicle: repairLog?.vehicle ?? null,
            customer: null,
            registrationPlate: '',
            name: '',
            surname: '',
            repairDate: repairLog?.repairDate ?? '',
            odometer: repairLog?.odometer ?? null
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
                                    form.setFieldValue('customer', null);
                                    form.setFieldValue('vehicle', null);
                                    form.setFieldValue('registrationPlate', '');
                                    if (newVehicle === false) {
                                        setNewVehicle(true);
                                    } else {
                                        form.setFieldValue('name', null);
                                        form.setFieldValue('surname', '');
                                        setNewVehicle(false);
                                        setNewCustomer(false);
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
                                    form.setFieldValue('customer', null);
                                    form.setFieldValue('name', null);
                                    form.setFieldValue('surname', '');
                                    if (newCustomer === false) {
                                        setNewCustomer(true);
                                        if (newVehicle === false) {
                                            form.setFieldValue('vehicle', null);
                                            form.setFieldValue('registrationPlate', '');
                                            setNewVehicle(true);
                                        }
                                    } else {
                                        setNewCustomer(false);
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
                form={form}
                sx={{ display: newVehicle === false ? 'initial' : 'none' }}
            />
            <CustomerInput
                name='customer'
                label='Zákazník'
                required
                readOnly={readOnly}
                form={form}
                sx={{ display: newVehicle === true && newCustomer === false ? 'initial' : 'none' }}
            />
            <TextInput
                name='name'
                label='Meno'
                form={form}
                readOnly={readOnly}
                required
                sx={{ display: newCustomer === true ? 'initial' : 'none' }}
                data-cy={'name-input'}
            />
            <TextInput
                name='surname'
                label='Priezvisko'
                form={form}
                readOnly={readOnly}
                sx={{ display: newCustomer === true ? 'initial' : 'none' }}
                data-cy={'surname-input'}
            />
            <TextInput
                name='registrationPlate'
                label='Evidenčné číslo'
                form={form}
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
                form={form}
                readOnly={readOnly}
                required
                data-cy={'content-textarea'}
            />
            <TextInput
                name='odometer'
                label='Stav odometra (km)'
                form={form}
                readOnly={readOnly}
                data-cy={'odometer-input'}
            />
            <DateInput
                form={form}
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
                                setReadOnly={(v) => {
                                    if (v === true) {
                                        form.reset();
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
                        );
                    }}
                </form.Subscribe>
            </Stack>
            {repairLog && readOnly && <TechnicalInfo object={repairLog} />}
        </Box>
    );
};

export default RepairLogDetail;
