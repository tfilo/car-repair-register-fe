import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import type { Customer } from '../../api/openapi/backend';
import { useForm } from '@tanstack/react-form';
import { useCreateCustomer, useDeleteCustomerById, useUpdateCustomer } from '../../api/queries/customerQueryOptions';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { yupValidator } from '@tanstack/yup-form-adapter';
import { useCallback, useState } from 'react';
import { formatCustomerName, formatVehicleMainDetail } from '../../utils/formatterUtil';
import yup from '../../yup-config';
import ErrorMessage from '../common/ErrorMessage';
import FormAction from '../common/FormAction';
import TextInput from '../common/TextInput';
import TechnicalInfo from '../common/TechnicalInfo';
import { useQuery } from '@tanstack/react-query';
import { findVehiclesOptions } from '../../api/queries/vehicleQueryOptions';
import { DirectionsCar } from '@mui/icons-material';

export type CustomerProps = {
    customer?: Customer;
};

const customerSchema = yup.object({
    name: yup.string().trim().required().max(64, 'Meno musí mať maximálne 64 znakov').label('Meno'),
    surname: yup.string().trim().optional().nullable().max(64, 'Priezvisko musí mať maximálne 64 znakov').label('Priezvisko'),
    mobile: yup.string().trim().optional().nullable().max(20, 'Telefón musí mať maximálne 20 znakov').label('Telefón'),
    email: yup
        .string()
        .email('Musí byť platný email')
        .trim()
        .optional()
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
                        <ListItemText primary={formatVehicleMainDetail(v, true)} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

const CustomerDetail: React.FC<CustomerProps> = ({ customer }) => {
    const router = useRouter();
    const [readOnly, setReadOnly] = useState(!!customer);
    const navigate = useNavigate({ from: '/customer/add' });
    const createCustomerMutation = useCreateCustomer();
    const updateCustomerMutation = useUpdateCustomer();
    const deleteCustomerByIdMutation = useDeleteCustomerById();

    const form = useForm({
        onSubmit: async ({ value }) => {
            try {
                let saved: Customer;
                if (customer !== undefined) {
                    saved = await updateCustomerMutation.mutateAsync({ id: customer.id, customer: value });
                } else {
                    saved = await createCustomerMutation.mutateAsync(value);
                }
                setReadOnly(true);
                await router.invalidate();
                navigate({
                    to: '/customer/$id',
                    params: {
                        id: `${saved.id}`
                    }
                });
            } catch (e) {
                console.log('Nastala chyba', e);
            }
        },
        validators: {
            onChange: customerSchema
        },
        defaultValues: {
            name: customer?.name ?? '',
            surname: customer?.surname ?? '',
            email: customer?.email ?? '',
            mobile: customer?.mobile ?? ''
        },
        validatorAdapter: yupValidator()
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
                {customer !== undefined ? formatCustomerName(customer) : 'Nový zákazník'}
            </Typography>
            <ErrorMessage
                mutationResult={[createCustomerMutation, updateCustomerMutation]}
                yupSchema={customerSchema}
            />
            <TextInput
                name='name'
                label='Meno'
                form={form}
                readOnly={readOnly}
                required
            />
            <TextInput
                name='surname'
                label='Priezvisko'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='mobile'
                label='Telefón'
                form={form}
                readOnly={readOnly}
            />
            <TextInput
                name='email'
                label='Email'
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
                                isPending={isSubmitting || deleteCustomerByIdMutation.isPending}
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
                                setReadOnly={(v) => setReadOnly(v)}
                                readOnly={readOnly}
                                allowDelete={customer !== undefined}
                                deleteModal={{
                                    title: 'Naozaj vymazať zákazníka vrátane všetkých záznamov?',
                                    body: 'Po potvrdení dôjde k odstráneniu zákazníka, vrátane jeho vozidiel a záznamov o opravách!'
                                }}
                            />
                        );
                    }}
                </form.Subscribe>
            </Stack>
            {customer && readOnly && (
                <>
                    <TechnicalInfo object={customer} />
                    <Divider />
                    <CustomerVehicles customerId={customer?.id} />
                </>
            )}
        </Box>
    );
};

export default CustomerDetail;
