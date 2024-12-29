import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import yup from '../../yup-config';
import { getCustomerByIdOptions } from '../../api/queries/customerQueryOptions';
import CustomerDetail from '../../components/customer/CustomerDetail';

export const Route = createFileRoute('/customer/$id')({
    beforeLoad: async ({ params }) => {
        return yup
            .number()
            .integer()
            .typeError(({ label }) => `${label} musí byť číslo.`)
            .defined()
            .required()
            .label('URL parameter id')
            .validate(Number(params.id));
    },
    loader: async ({ context: { queryClient }, params: { id } }) => queryClient.ensureQueryData(getCustomerByIdOptions(+id)),
    component: RouteComponent
});

function RouteComponent() {
    const routeApi = getRouteApi('/customer/$id');
    const data = routeApi.useLoaderData();
    return <CustomerDetail customer={data} />;
}
