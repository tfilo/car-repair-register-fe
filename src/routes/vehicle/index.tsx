import { createFileRoute } from '@tanstack/react-router';
import yup from '../../yup-config';
import { findVehiclesOptions } from '../../api/queries/vehicleQueryOptions';
import Vehicles from '../../components/vehicle/Vehicles';

const vehicleSearchSchema = yup.object({
    page: yup.number().default(0).integer(),
    size: yup.number().default(10).integer(),
    sort: yup.array().of(yup.string().defined().nonNullable()),
    query: yup.string().trim(),
    customerId: yup.number().optional().default(undefined).integer()
});

export const Route = createFileRoute('/vehicle/')({
    validateSearch: (search) => {
        return vehicleSearchSchema.validateSync(search);
    },
    loaderDeps: ({ search: { page, size, sort, query, customerId } }) => ({
        page,
        size,
        sort,
        query,
        customerId
    }),
    loader: async ({ context: { queryClient }, deps: { page, size, sort, query, customerId } }) => {
        return queryClient.ensureQueryData(findVehiclesOptions(page, size, sort, query, customerId));
    },
    component: Vehicles
});
