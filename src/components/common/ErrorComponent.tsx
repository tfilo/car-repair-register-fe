import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ValidationError } from 'yup';
import { getLocalizedErrorMessage } from '../../utils/errorBundle';

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
    const localizedMessage = getLocalizedErrorMessage(error.message);
    let title = error.name ?? 'Nastala chyba';

    if (error instanceof ValidationError) {
        title = 'Nastala chyba pri spracovaní URL adresy';
    }

    return (
        <div>
            <div>
                <h3>{title}</h3>
                <p>{localizedMessage}</p>
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
