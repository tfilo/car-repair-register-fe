import { Alert } from '@mui/material';
import { Error } from '@mui/icons-material';
import { getLocalizedErrorMessage } from '../../utils/errorBundle';
import { instanceOfErrorMessage } from '../../api/openapi/backend';
import yup from '../../yup-config';

type ErrorMessageProps = {
    mutationResult: {
        isError: boolean;
        error: Error | null;
    }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yupSchema: yup.ObjectSchema<any>;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ mutationResult, yupSchema }) => {
    const getLabel = (fieldName: string) => {
        if (yupSchema.fields[fieldName]) {
            const description = yupSchema.fields[fieldName].describe();
            if ('label' in description) {
                return description.label ?? fieldName;
            }
        }
    };

    return (
        <>
            {mutationResult.map((mr, idx) => {
                if (mr.isError && !!mr.error) {
                    return (
                        <Alert
                            key={`${idx}_${mr.error?.message}`}
                            icon={<Error fontSize='inherit' />}
                            severity='error'
                        >
                            {getLocalizedErrorMessage(mr.error.message)}
                            {instanceOfErrorMessage(mr.error) && mr.error.fieldError && mr.error.fieldError.length > 0 && (
                                <ul
                                    style={{
                                        listStylePosition: 'inside',
                                        paddingLeft: 0
                                    }}
                                >
                                    {mr.error.fieldError.map((fe, idx) => (
                                        <li key={`${idx}_${fe.fieldName}`}>{getLabel(fe.fieldName) + ' - ' + fe.errorMessage}</li>
                                    ))}
                                </ul>
                            )}
                        </Alert>
                    );
                }
            })}
        </>
    );
};

export default ErrorMessage;
