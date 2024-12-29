import { createFileRoute } from '@tanstack/react-router';
import yup from '../../yup-config';
import { getVehicleByIdOptions } from '../../api/queries/vehicleQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import VehicleDetail from '../../components/vehicle/VehicleDetail';

export const Route = createFileRoute('/vehicle/$id')({
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
    loader: async ({ context: { queryClient }, params: { id } }) => queryClient.ensureQueryData(getVehicleByIdOptions(+id)),

    component: RouteComponent
});

function RouteComponent() {
    const params = Route.useParams();
    const { data: vehicle } = useSuspenseQuery(getVehicleByIdOptions(+params.id));
    return <VehicleDetail vehicle={vehicle} />;
}
