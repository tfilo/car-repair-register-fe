import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import yup from '../../yup-config';
import { getVehicleByIdOptions } from '../../api/queries/vehicleQueryOptions';
import VehicleDetail from '../../components/vehicle/VehicleDetail';
import Loader from '../../components/common/Loader';

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
    component: RouteComponent,
    pendingComponent: Loader
});

function RouteComponent() {
    const routeApi = getRouteApi('/vehicle/$id');
    const data = routeApi.useLoaderData();
    return <VehicleDetail vehicle={data} />;
}
