import { Autocomplete, CircularProgress, SxProps, TextField, Theme } from '@mui/material';
import { DeepKeys, ReactFormExtendedApi, Validator } from '@tanstack/react-form';
import { formatCustomerNameAsString } from '../../utils/formatterUtil';
import React, { ReactElement, useState } from 'react';
import { Vehicle } from '../../api/openapi/backend';
import { queryClient } from '../../queryClient';
import { useDebouncedCallback } from 'use-debounce';
import { findVehiclesOptions } from '../../api/queries/vehicleQueryOptions';

type VehicleInputProps<TFormData, TFormValidator extends Validator<TFormData, unknown>, TName extends DeepKeys<TFormData>> = {
    form: ReactFormExtendedApi<TFormData, TFormValidator>;
    name: TName;
    label: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
};

type VehicleInputComponent = <TFormData, TFormValidator extends Validator<TFormData, unknown>, TName extends DeepKeys<TFormData>>(
    props: VehicleInputProps<TFormData, TFormValidator, TName>
) => ReactElement | null;

const VehicleInput: VehicleInputComponent = ({ form, readOnly, required, name, label, sx }) => {
    const [loadinVehicles, setLoadingVehicles] = useState(false);
    const [customerOpen, setCustomerOpen] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

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

    return (
        <form.Field
            name={name}
            children={({ state, handleChange, handleBlur }) => {
                return (
                    <Autocomplete
                        sx={sx}
                        disablePortal
                        open={customerOpen}
                        filterOptions={(x) => x}
                        options={vehicles}
                        loading={loadinVehicles}
                        onOpen={handleCustomerOpen}
                        onClose={handleCustomerClose}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(o) => o.registrationPlate + ' - ' + formatCustomerNameAsString(o.customer)}
                        onChange={(_, val) => handleChange(val as Parameters<typeof handleChange>[0])}
                        getOptionKey={(o) => o.id}
                        value={state.value as Vehicle}
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
                                                {loadinVehicles ? (
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

export default VehicleInput;
