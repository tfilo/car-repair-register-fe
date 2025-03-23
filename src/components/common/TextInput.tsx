import React from 'react';
import { SxProps, TextField, Theme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { get } from 'lodash';
import { formatErrorToString } from '../../utils/formatterUtil';
import { isNotBlankString } from '../../utils/typeGuardUtil';

type TextInputProps = {
    name: string;
    label: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
    style?: React.CSSProperties;
    'data-cy'?: string;
};

const TextInput: React.FC<TextInputProps> = ({ readOnly, required, name, label, sx, style, 'data-cy': dataCy }) => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    // Field error object
    const errorObj = get(errors, name);
    // Message from error object
    const errorMsg = formatErrorToString(errorObj?.message);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                    fullWidth
                    sx={sx}
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    label={label}
                    required={required}
                    error={isNotBlankString(errorMsg)}
                    helperText={errorMsg}
                    slotProps={{
                        input: {
                            readOnly
                        },
                        htmlInput: {
                            style
                        }
                    }}
                    autoComplete='off'
                    data-cy={dataCy}
                />
            )}
        />
    );
};

export default TextInput;
