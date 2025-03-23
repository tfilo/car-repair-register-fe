import React, { useId, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { get } from 'lodash';
import { FormControl, FormHelperText, InputLabel, styled, SxProps, Theme, TextareaAutosize } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { formatErrorToString } from '../../utils/formatterUtil';
import { isNotBlankString } from '../../utils/typeGuardUtil';

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

type TextareaInputProps = {
    name: string;
    label: string;
    readOnly?: boolean;
    required?: boolean;
    'data-cy'?: string;
};

const TextareaInput: React.FC<TextareaInputProps> = ({ readOnly, required, name, label, 'data-cy': dataCy }) => {
    const uniqueId = useId();

    const {
        control,
        formState: { errors }
    } = useFormContext();

    // Field error object
    const errorObj = get(errors, name);
    // Message from error object
    const errorMsg = formatErrorToString(errorObj?.message);

    const innerSx: SxProps<Theme> | undefined = useMemo(() => {
        return isNotBlankString(errorMsg)
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
    }, [errorMsg]);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <FormControl>
                    <InputLabel
                        htmlFor={`${uniqueId}_${name}`}
                        shrink={true}
                        sx={{ background: '#fff', paddingX: '4px' }}
                        error={isNotBlankString(errorMsg)}
                        required={required}
                    >
                        {label}
                    </InputLabel>
                    <Textarea
                        id={`${uniqueId}_${name}`}
                        aria-describedby={`${uniqueId}_${name}-helper`}
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        minRows={6}
                        required={required}
                        sx={innerSx}
                        readOnly={readOnly}
                        autoComplete='off'
                        data-cy={dataCy}
                    />
                    <FormHelperText
                        error={isNotBlankString(errorMsg)}
                        id={`${uniqueId}_${name}-helper`}
                    >
                        {errorMsg}
                    </FormHelperText>
                </FormControl>
            )}
        />
    );
};

export default TextareaInput;
