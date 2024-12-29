import type { NotFoundRouteProps } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

const NotFound: React.FC<NotFoundRouteProps> = () => {
    return (
        <div>
            <div>
                <h3>Požadovaná stránka sa nenašla</h3>
                <p>
                    <Link to='/'>Späť na domovskú obrazovku.</Link>
                </p>
            </div>
        </div>
    );
};

export default NotFound;
