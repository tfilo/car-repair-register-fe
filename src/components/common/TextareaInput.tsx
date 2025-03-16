import { FormControl, FormHelperText, InputLabel, styled, SxProps, Theme, TextareaAutosize } from '@mui/material';
import { DeepKeys, ReactFormExtendedApi, Validator } from '@tanstack/react-form';
import { ReactElement, useId } from 'react';
import { blue, grey } from '@mui/material/colors';

const Textarea = styled(TextareaAutosize)(
    () => `
    box-sizing: border-box;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.2;
    padding: 12px;
    border-radius: 4px;
    color: ${grey[900]};
    background: '#fff';
    border: 1px solid ${grey[400]};
    
    &:focus {
      border-color: ${blue[700]};
      box-shadow: 0 0 0 1px ${blue[700]};
    }
    
    /* firefox */
    &:focus-visible {
      outline: 0;
    }
`
);

type TextareaInputProps<TFormData, TFormValidator extends Validator<TFormData, unknown>, TName extends DeepKeys<TFormData>> = {
    form: ReactFormExtendedApi<TFormData, TFormValidator>;
    name: TName;
    label: string;
    readOnly?: boolean;
    required?: boolean;
};

type TextareaInputComponent = <TFormData, TFormValidator extends Validator<TFormData, unknown>, TName extends DeepKeys<TFormData>>(
    props: TextareaInputProps<TFormData, TFormValidator, TName>
) => ReactElement | null;

const TextareaInput: TextareaInputComponent = ({ form, readOnly, required, name, label }) => {
    const uniqueId = useId();
    return (
        <form.Field
            name={name}
            children={({ state, handleChange, handleBlur }) => {
                const innerSx: SxProps<Theme> | undefined =
                    state.meta.isTouched && state.meta.errors.length > 0
                        ? [
                              {
                                  '&:focus': {
                                      boxShadow: '0 0 0 1px #d32f2f',
                                      borderColor: '#d32f2f'
                                  }
                              },
                              {
                                  borderColor: '#d32f2f'
                              }
                          ]
                        : undefined;

                return (
                    <FormControl>
                        <InputLabel
                            htmlFor={`${uniqueId}_${name}`}
                            shrink={true}
                            sx={{ background: '#fff', paddingX: '4px' }}
                            error={state.meta.isTouched && state.meta.errors.length > 0}
                            required={required}
                        >
                            {label}
                        </InputLabel>
                        <Textarea
                            id={`${uniqueId}_${name}`}
                            aria-describedby={`${uniqueId}_${name}-helper`}
                            value={state.value as string}
                            onChange={(e) => handleChange(e.target.value as Parameters<typeof handleChange>[0])}
                            onBlur={handleBlur}
                            minRows={6}
                            required={required}
                            sx={innerSx}
                            readOnly={readOnly}
                            autoComplete='off'
                        />
                        <FormHelperText
                            error={state.meta.isTouched && state.meta.errors.length > 0}
                            id={`${uniqueId}_${name}-helper`}
                        >
                            {state.meta.isTouched && state.meta.errors.join(';')}
                        </FormHelperText>
                    </FormControl>
                );
            }}
        />
    );
};

export default TextareaInput;
