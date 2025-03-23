import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormHelperText, SxProps, Theme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { formatErrorToString } from '../../utils/formatterUtil';
import { isNotBlankString } from '../../utils/typeGuardUtil';

type DateInputProps = {
    name: string;
    label: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
    'data-cy'?: string;
};

const DateInput: React.FC<DateInputProps> = ({ readOnly, required, name, label, sx, 'data-cy': dataCy }) => {
    const uniqueId = useId();
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
                <FormControl>
                    <DatePicker
                        value={value ? dayjs(value as string) : null}
                        onChange={(e) => {
                            if (e !== null) {
                                const iso = e.format('YYYY-MM-DD');
                                onChange(iso);
                            }
                        }}
                        format='DD.MM.YYYY'
                        label={label}
                        aria-describedby={`${uniqueId}_repairDate-helper`}
                        readOnly={readOnly}
                        sx={sx}
                        slotProps={{
                            textField: {
                                required: required,
                                error: isNotBlankString(errorMsg),
                                // @ts-expect-error for testing only
                                'data-cy': dataCy,
                                onBlur: onBlur
                            }
                        }}
                    />
                    <FormHelperText
                        error={isNotBlankString(errorMsg)}
                        id={`${uniqueId}_repairDate-helper`}
                    >
                        {errorMsg}
                    </FormHelperText>
                </FormControl>
            )}
        />
    );
};

export default DateInput;
