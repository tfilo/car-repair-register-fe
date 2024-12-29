import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import yup from '../yup-config';
import { getRepairLogByIdOptions } from './../api/queries/repairLogQueryOptions';
import RepairLogDetail from '../components/repair-log/RepairLogDetail';

export const Route = createFileRoute('/$id')({
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
    loader: async ({ context: { queryClient }, params: { id } }) => queryClient.ensureQueryData(getRepairLogByIdOptions(+id)),
    component: RouteComponent
});

function RouteComponent() {
    const routeApi = getRouteApi('/$id');
    const data = routeApi.useLoaderData();
    return <RepairLogDetail repairLog={data} />;
}
