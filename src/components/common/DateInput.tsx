import { FormControl, FormHelperText, SxProps, Theme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DeepKeys, ReactFormExtendedApi, Validator } from '@tanstack/react-form';
import { ReactElement, useId } from 'react';
import dayjs from 'dayjs';

type DateInputProps<TFormData, TFormValidator extends Validator<TFormData, unknown>, TName extends DeepKeys<TFormData>> = {
    form: ReactFormExtendedApi<TFormData, TFormValidator>;
    name: TName;
    label: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
    'data-cy'?: string;
};

type DateInputComponent = <TFormData, TFormValidator extends Validator<TFormData, unknown>, TName extends DeepKeys<TFormData>>(
    props: DateInputProps<TFormData, TFormValidator, TName>
) => ReactElement | null;

const DateInput: DateInputComponent = ({ form, readOnly, required, name, label, sx, 'data-cy': dataCy }) => {
    const uniqueId = useId();

    return (
        <form.Field name={name}>
            {({ state, handleChange }) => {
                return (
                    <FormControl>
                        <DatePicker
                            value={state.value ? dayjs(state.value as string) : null}
                            onChange={(e) => {
                                if (e !== null) {
                                    const iso = e.format('YYYY-MM-DD');
                                    handleChange(iso as Parameters<typeof handleChange>[0]);
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
                                    error: state.meta.isTouched && state.meta.errors.length > 0,
                                    // @ts-expect-error for testing only
                                    'data-cy': dataCy
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
        </form.Field>
    );
};

export default DateInput;
