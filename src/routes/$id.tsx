import { createFileRoute } from '@tanstack/react-router';
import yup from '../yup-config';
import { useSuspenseQuery } from '@tanstack/react-query';
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
    const params = Route.useParams();
    const { data: repairLog } = useSuspenseQuery(getRepairLogByIdOptions(+params.id));
    return <RepairLogDetail repairLog={repairLog} />;
}
