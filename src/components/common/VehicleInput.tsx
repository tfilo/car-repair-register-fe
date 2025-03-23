import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { get } from 'lodash';
import { useDebouncedCallback } from 'use-debounce';
import { Autocomplete, CircularProgress, SxProps, TextField, Theme } from '@mui/material';
import { Vehicle } from '../../api/openapi/backend';
import { findVehiclesOptions } from '../../api/queries/vehicleQueryOptions';
import { queryClient } from '../../queryClient';
import { formatCustomerNameAsString, formatErrorToString } from '../../utils/formatterUtil';
import { isNotBlankString } from '../../utils/typeGuardUtil';

type VehicleInputProps = {
    name: string;
    label: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
};

const VehicleInput: React.FC<VehicleInputProps> = ({ readOnly, required, name, label, sx }) => {
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [customerOpen, setCustomerOpen] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const {
        control,
        formState: { errors }
    } = useFormContext();

    // Field error object
    const errorObj = get(errors, name);
    // Message from error object
    const errorMsg = formatErrorToString(errorObj?.message);

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
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <Autocomplete
                    sx={sx}
                    disablePortal
                    open={customerOpen}
                    filterOptions={(x) => x}
                    options={vehicles}
                    loading={loadingVehicles}
                    onOpen={handleCustomerOpen}
                    onClose={handleCustomerClose}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(o) => o.registrationPlate + ' - ' + formatCustomerNameAsString(o.customer)}
                    onChange={(_, val) => onChange(val)}
                    getOptionKey={(o) => o.id}
                    value={value as Vehicle}
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
                                            {loadingVehicles ? (
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
                            data-cy='vehicle-autocomplete'
                        />
                    )}
                />
            )}
        />
    );
};

export default VehicleInput;
