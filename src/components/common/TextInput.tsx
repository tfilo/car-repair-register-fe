import { SxProps, TextField, Theme } from '@mui/material';
import { ReactFormExtendedApi } from '@tanstack/react-form';

type TextInputProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: ReactFormExtendedApi<any, any>;
    label: string;
    name: string;
    readOnly?: boolean;
    required?: boolean;
    sx?: SxProps<Theme>;
};

const TextInput: React.FC<TextInputProps> = ({ form, readOnly, required, name, label, sx }) => {
    return (
        <form.Field
            name={name}
            children={({ state, handleChange, handleBlur }) => {
                return (
                    <TextField
                        fullWidth
                        sx={sx}
                        defaultValue={state.value}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        label={label}
                        required={required}
                        error={state.meta.isTouched && state.meta.errors.length > 0}
                        helperText={state.meta.isTouched && state.meta.errors.join(';')}
                        slotProps={{
                            input: {
                                readOnly
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
