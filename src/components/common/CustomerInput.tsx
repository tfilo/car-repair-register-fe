import { Autocomplete, CircularProgress, SxProps, TextField, Theme } from '@mui/material';
import { ReactFormExtendedApi } from '@tanstack/react-form';
import { formatCustomerNameAsString } from '../../utils/formatterUtil';
import React, { useState } from 'react';
import { Customer } from '../../api/openapi/backend';
import { queryClient } from '../../queryClient';
import { findCustomersOptions } from '../../api/queries/customerQueryOptions';
import { useDebouncedCallback } from 'use-debounce';

type CustomerInputProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: ReactFormExtendedApi<any, any>;
    label: string;
    name: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
};

const CustomerInput: React.FC<CustomerInputProps> = ({ form, readOnly, required, name, label, sx }) => {
    const [loadinCustomers, setLoadingCustomers] = useState(false);
    const [customerOpen, setCustomerOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const handleCustomerOpen = () => {
        setCustomerOpen(true);
        (async () => {
            setLoadingCustomers(true);
            const res = await queryClient.fetchQuery(findCustomersOptions(0, 10, ['name,asc', 'surname,asc'], ''));
            setLoadingCustomers(false);
            setCustomers([...(res.content ?? [])]);
        })();
    };

    const handleCustomerClose = () => {
        setCustomerOpen(false);
        setCustomers([]);
    };

    const debouncedSearch = useDebouncedCallback(async (query: string) => {
        const res = await queryClient.fetchQuery(findCustomersOptions(0, 10, ['name,asc', 'surname,asc'], query));
        setCustomers([...(res.content ?? [])]);
    }, 1000);

    return (
        <form.Field
            name={name}
            children={({ state, handleChange, handleBlur }) => {
                return (
                    <Autocomplete
                        sx={sx}
                        fullWidth
                        disablePortal
                        open={customerOpen}
                        filterOptions={(x) => x}
                        options={customers}
                        loading={loadinCustomers}
                        onOpen={handleCustomerOpen}
                        onClose={handleCustomerClose}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(o) => formatCustomerNameAsString(o)}
                        onChange={(_, val) => handleChange(val)}
                        value={state.value}
                        onBlur={handleBlur}
                        autoHighlight
                        readOnly={readOnly}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={label}
                                required={required}
                                onChange={(e) => debouncedSearch(e.target.value)}
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loadinCustomers ? (
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
                                error={state.meta.isTouched && state.meta.errors.length > 0}
                                helperText={state.meta.isTouched && state.meta.errors.join(';')}
                            />
                        )}
                    />
                );
            }}
        />
    );
};

export default CustomerInput;
