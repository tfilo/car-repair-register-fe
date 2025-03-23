import React, { useCallback, useState } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Customer } from '../../api/openapi/backend';
import { useCreateCustomer, useDeleteCustomerById, useUpdateCustomer } from '../../api/queries/customerQueryOptions';
import { findVehiclesOptions } from '../../api/queries/vehicleQueryOptions';
import yup from '../../yup-config';
import { formatCustomerName, formatVehicleMainDetail } from '../../utils/formatterUtil';
import ErrorMessage from '../common/ErrorMessage';
import FormAction from '../common/FormAction';
import TextInput from '../common/TextInput';
import TechnicalInfo from '../common/TechnicalInfo';
import { FormProvider, useForm } from 'react-hook-form';

export type CustomerProps = {
    customer?: Customer;
};

const customerSchema = yup.object({
    name: yup.string().trim().required().max(64, 'Meno musí mať maximálne 64 znakov').label('Meno'),
    surname: yup.string().trim().defined().emptyAsNull().nullable().max(64, 'Priezvisko musí mať maximálne 64 znakov').label('Priezvisko'),
    mobile: yup.string().trim().defined().emptyAsNull().nullable().max(20, 'Telefón musí mať maximálne 20 znakov').label('Telefón'),
    email: yup
        .string()
        .email('Musí byť platný email')
        .trim()
        .defined()
        .emptyAsNull()
        .nullable()
        .max(320, 'Email musí mať maximálne 320 znakov')
        .label('Email')
});

type CustomerVehiclesProps = {
    customerId: number;
};

const CustomerVehicles: React.FC<CustomerVehiclesProps> = ({ customerId }) => {
    const navigate = useNavigate();
    const findVehicles = useQuery(findVehiclesOptions(0, 1000, undefined, undefined, customerId));

    return (
        <>
            <Typography
                variant='h6'
                component='div'
            >
                Zoznam vozidiel zákazníka
            </Typography>
            <List dense={true}>
                {findVehicles.data?.content?.map((v) => (
                    <ListItem
                        key={v.id}
                        onClick={() =>
                            navigate({
                                to: '/vehicle/$id',
                                params: {
                                    id: `${v.id}`
                                }
                            })
                        }
                        sx={{
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon>
                            <DirectionsCar />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    color='primary'
                                    sx={{
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {formatVehicleMainDetail(v, true)}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

const CustomerDetail: React.FC<CustomerProps> = ({ customer }) => {
    const router = useRouter();
    const [readOnly, setReadOnly] = useState(!!customer);
    const navigate = useNavigate();
    const createCustomerMutation = useCreateCustomer();
    const updateCustomerMutation = useUpdateCustomer();
    const deleteCustomerByIdMutation = useDeleteCustomerById();

    const methods = useForm({
        resolver: yupResolver(customerSchema, {
            stripUnknown: true // Remove non used attributes
        }),
        defaultValues: {
            name: customer?.name ?? '',
            surname: customer?.surname ?? '',
            email: customer?.email ?? '',
            mobile: customer?.mobile ?? ''
        }
    });

    const {
        handleSubmit,
        reset,
        formState: { isLoading, isSubmitting, isValidating, isSubmitted, isValid }
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            let saved: Customer;
            if (customer !== undefined) {
                saved = await updateCustomerMutation.mutateAsync({ id: customer.id, customer: data });
            } else {
                saved = await createCustomerMutation.mutateAsync(data);
            }
            setReadOnly(true);
            router.invalidate();
            reset({
                name: saved.name ?? '',
                surname: saved.surname ?? '',
                email: saved.email ?? '',
                mobile: saved.mobile ?? ''
            });
            navigate({
                to: '/customer/$id',
                params: {
                    id: `${saved.id}`
                }
            });
        } catch (e) {
            console.log('Nastala chyba', e);
        }
    });

    const handleCustomerDelete = useCallback(() => {
        if (customer !== undefined) {
            deleteCustomerByIdMutation.mutate(customer.id, {
                onSuccess: () => {
                    navigate({
                        to: '/customer',
                        search: {
                            page: 0,
                            size: 10
                        }
                    });
                }
            });
        }
    }, [customer, deleteCustomerByIdMutation, navigate]);

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
                    data-cy='customer-title'
                >
                    {customer !== undefined ? formatCustomerName(customer) : 'Nový zákazník'}
                </Typography>
                <ErrorMessage
                    mutationResult={[createCustomerMutation, updateCustomerMutation]}
                    yupSchema={customerSchema}
                />
                <TextInput
                    name='name'
                    label='Meno'
                    readOnly={readOnly}
                    required
                    data-cy={'name-input'}
                />
                <TextInput
                    name='surname'
                    label='Priezvisko'
                    readOnly={readOnly}
                    data-cy={'surname-input'}
                />
                <TextInput
                    name='mobile'
                    label='Telefón'
                    readOnly={readOnly}
                    data-cy={'mobile-input'}
                />
                <TextInput
                    name='email'
                    label='Email'
                    readOnly={readOnly}
                    data-cy={'email-input'}
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
                        isPending={isPending || deleteCustomerByIdMutation.isPending}
                        onBackHandler={() =>
                            navigate({
                                to: '/customer',
                                search: {
                                    page: 0,
                                    size: 10
                                }
                            })
                        }
                        onDeleteHandler={handleCustomerDelete}
                        setReadOnly={(v) => {
                            if (v === true) {
                                reset();
                            }
                            setReadOnly(v);
                        }}
                        readOnly={readOnly}
                        allowDelete={customer !== undefined}
                        deleteModal={{
                            title: 'Naozaj vymazať zákazníka vrátane všetkých záznamov?',
                            body: 'Po potvrdení dôjde k odstráneniu zákazníka, vrátane jeho vozidiel a záznamov o opravách!'
                        }}
                    />
                </Stack>
                {customer && readOnly && (
                    <>
                        <TechnicalInfo object={customer} />
                        <Divider />
                        <CustomerVehicles customerId={customer?.id} />
                    </>
                )}
            </Box>
        </FormProvider>
    );
};

export default CustomerDetail;
