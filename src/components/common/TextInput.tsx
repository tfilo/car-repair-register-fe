import { SxProps, TextField, Theme } from '@mui/material';
import { DeepKeys, ReactFormExtendedApi, Validator } from '@tanstack/react-form';
import { ReactElement } from 'react';

type TextInputProps<TFormData, TFormValidator extends Validator<TFormData, unknown>, TName extends DeepKeys<TFormData>> = {
    form: ReactFormExtendedApi<TFormData, TFormValidator>;
    name: TName;
    label: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
    style?: React.CSSProperties;
};

type TextInputComponent = <TFormData, TFormValidator extends Validator<TFormData, unknown>, TName extends DeepKeys<TFormData>>(
    props: TextInputProps<TFormData, TFormValidator, TName>
) => ReactElement | null;

const TextInput: TextInputComponent = ({ form, readOnly, required, name, label, sx, style }) => {
    return (
        <form.Field
            name={name}
            children={({ state, handleChange, handleBlur }) => {
                return (
                    <TextField
                        fullWidth
                        sx={sx}
                        value={state.value ?? ''}
                        onChange={(e) => handleChange(e.target.value as Parameters<typeof handleChange>[0])}
                        onBlur={handleBlur}
                        label={label}
                        required={required}
                        error={state.meta.isTouched && state.meta.errors.length > 0}
                        helperText={state.meta.isTouched && state.meta.errors.join(';')}
                        slotProps={{
                            input: {
                                readOnly
                            },
                            htmlInput: {
                                style
                            }
                        }}
                        autoComplete='off'
                    />
                );
            }}
        />
    );
};

export default TextInput;
