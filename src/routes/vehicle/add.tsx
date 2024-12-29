import { createFileRoute } from '@tanstack/react-router';
import VehicleDetail from '../../components/vehicle/VehicleDetail';

export const Route = createFileRoute('/vehicle/add')({
    component: RouteComponent
});

function RouteComponent() {
    return <VehicleDetail />;
}
