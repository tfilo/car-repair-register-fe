import { FormControl, FormHelperText, SxProps, Theme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ReactFormExtendedApi } from '@tanstack/react-form';
import { useId } from 'react';
import dayjs from 'dayjs';

type DateInputProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: ReactFormExtendedApi<any, any>;
    label: string;
    name: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
};

const DateInput: React.FC<DateInputProps> = ({ form, readOnly, required, name, label, sx }) => {
    const uniqueId = useId();

    return (
        <form.Field
            name={name}
            children={({ state, handleChange }) => {
                return (
                    <FormControl>
                        <DatePicker
                            value={state.value ? dayjs(state.value) : null}
                            onChange={(e) => {
                                if (e !== null) {
                                    const iso = e.format('YYYY-MM-DD');
                                    handleChange(iso);
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
                                    error: state.meta.isTouched && state.meta.errors.length > 0
                                }
                            }}
                        />
                        <FormHelperText
                            error={state.meta.isTouched && state.meta.errors.length > 0}
                            id={`${uniqueId}_repairDate-helper`}
                        >
                            {state.meta.isTouched && state.meta.errors.join(';')}
                        </FormHelperText>
                    </FormControl>
                );
            }}
        />
    );
};

export default DateInput;
