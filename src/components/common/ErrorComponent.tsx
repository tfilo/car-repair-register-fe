import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ValidationError } from 'yup';

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
    let title = error.name ?? 'Neznáma chyba';

    if (error instanceof ValidationError) {
        title = 'Nastala chyba pri spracovaní URL adresy';
    }

    return (
        <div>
            <div>
                <h3>{title}</h3>
                <p>{error.message}</p>
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
