import { createFileRoute } from '@tanstack/react-router';
import VehicleDetail from '../../components/vehicle/VehicleDetail';

export const Route = createFileRoute('/vehicle/add')({
    component: RouteComponent
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
    return <VehicleDetail />;
}
