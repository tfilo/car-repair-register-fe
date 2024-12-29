import { createFileRoute } from '@tanstack/react-router';
import RepairLogDetail from '../components/repair-log/RepairLogDetail';

export const Route = createFileRoute('/add')({
    component: RouteComponent
});

function RouteComponent() {
    return <RepairLogDetail />;
}
