import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { get } from 'lodash';
import { Autocomplete, CircularProgress, SxProps, TextField, Theme } from '@mui/material';
import { Customer } from '../../api/openapi/backend';
import { findCustomersOptions } from '../../api/queries/customerQueryOptions';
import { queryClient } from '../../queryClient';
import { formatCustomerNameAsString, formatErrorToString } from '../../utils/formatterUtil';
import { isNotBlankString } from '../../utils/typeGuardUtil';

type CustomerInputProps = {
    name: string;
    label: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
};

const CustomerInput: React.FC<CustomerInputProps> = ({ readOnly, required, name, label, sx }) => {
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [customerOpen, setCustomerOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const {
        control,
        formState: { errors }
    } = useFormContext();

    // Field error object
    const errorObj = get(errors, name);
    // Message from error object
    const errorMsg = formatErrorToString(errorObj);

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
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => {
                const checkedValue = value && isNaN(value.id) ? null : value;
                return (
                    <Autocomplete
                        sx={sx}
                        fullWidth
                        disablePortal
                        open={customerOpen}
                        filterOptions={(x) => x}
                        options={customers}
                        loading={loadingCustomers}
                        onOpen={handleCustomerOpen}
                        onClose={handleCustomerClose}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(o) => formatCustomerNameAsString(o)}
                        onChange={(_, val) => onChange(val)}
                        getOptionKey={(o) => o.id}
                        value={checkedValue as Customer}
                        onBlur={onBlur}
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
                                                {loadingCustomers ? (
                                                    <CircularProgress
                                                        color='inherit'
                                                        size={20}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                        autoComplete: 'off'
                                    }
                                }}
                                error={isNotBlankString(errorMsg)}
                                helperText={errorMsg}
                                data-cy='customer-autocomplete'
                            />
                        )}
                    />
                );
            }}
        />
    );
};

export default CustomerInput;
