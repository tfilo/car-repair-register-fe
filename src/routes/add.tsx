import { createFileRoute } from '@tanstack/react-router';
import RepairLogDetail from '../components/repair-log/RepairLogDetail';

export const Route = createFileRoute('/add')({
    component: RouteComponent
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
    return <RepairLogDetail />;
}
