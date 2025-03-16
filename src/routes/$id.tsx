import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import yup from '../yup-config';
import { getRepairLogByIdOptions } from './../api/queries/repairLogQueryOptions';
import RepairLogDetail from '../components/repair-log/RepairLogDetail';
import Loader from '../components/common/Loader';

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
    component: RouteComponent,
    pendingComponent: Loader
});

function RouteComponent() {
    const data = useLoaderData({
        from: '/$id'
    });
    return <RepairLogDetail repairLog={data} />;
}
