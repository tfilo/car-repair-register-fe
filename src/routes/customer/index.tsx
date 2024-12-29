import { createFileRoute } from '@tanstack/react-router';
import yup from '../../yup-config';
import { findCustomersOptions } from '../../api/queries/customerQueryOptions';
import Customers from '../../components/customer/Customers';

const customerSearchSchema = yup.object({
    page: yup.number().default(0).integer(),
    size: yup.number().default(10).integer(),
    sort: yup.array().of(yup.string().defined().nonNullable()),
    query: yup.string().trim()
});

export const Route = createFileRoute('/customer/')({
    validateSearch: (search) => {
        return customerSearchSchema.validateSync(search);
    },
    loaderDeps: ({ search: { page, size, sort, query } }) => ({
        page,
        size,
        sort,
        query
    }),
    loader: async ({ context: { queryClient }, deps: { page, size, sort, query } }) => {
        return queryClient.ensureQueryData(findCustomersOptions(page, size, sort, query));
    },
    component: Customers
});
