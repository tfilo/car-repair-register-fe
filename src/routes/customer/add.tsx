import { createFileRoute } from '@tanstack/react-router';
import CustomerDetail from '../../components/customer/CustomerDetail';

export const Route = createFileRoute('/customer/add')({
    component: RouteComponent
});

function RouteComponent() {
    return <CustomerDetail />;
}
