import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ValidationError } from 'yup';
import { getLocalizedErrorMessage } from '../../utils/errorBundle';

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
    const message: string = error !== null && typeof error === 'object' && 'message' in error ? `${error.message}` : '';
    let title = error !== null && typeof error === 'object' && 'name' in error ? `$error.name}` : 'Nastala chyba';

    if (error instanceof ValidationError) {
        title = 'Nastala chyba pri spracovaní URL adresy';
    }

    return (
        <div>
            <div>
                <h3>{title}</h3>
                <p>{getLocalizedErrorMessage(message)}</p>
                <p>
                    <Link
                        to='/'
                        search={{ page: 0, size: 10 }}
                    >
                        Späť na domovskú obrazovku.
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ErrorComponent;
