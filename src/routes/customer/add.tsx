import { createFileRoute } from '@tanstack/react-router';
import CustomerDetail from '../../components/customer/CustomerDetail';

export const Route = createFileRoute('/customer/add')({
    component: RouteComponent
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
    return <CustomerDetail />;
}
