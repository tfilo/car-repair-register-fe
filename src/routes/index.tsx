import { createFileRoute } from '@tanstack/react-router';
import RepairLogs from '../components/repair-log/RepairLogs';
import yup from '../yup-config';
import { findRepairLogsOptions } from '../api/queries/repairLogQueryOptions';

const recordsLogSearchSchema = yup.object({
    page: yup.number().default(0).integer(),
    size: yup.number().default(10).integer(),
    sort: yup.array().of(yup.string().defined().nonNullable()),
    query: yup.string().trim(),
    vehicleId: yup.number().integer()
});

export const Route = createFileRoute('/')({
    validateSearch: (search) => {
        return recordsLogSearchSchema.validateSync(search);
    },
    loaderDeps: ({ search: { page, size, sort, query, vehicleId } }) => ({ page, size, sort, query, vehicleId }),
    loader: async ({ context: { queryClient }, deps: { page, size, sort, query, vehicleId } }) =>
        queryClient.ensureQueryData(findRepairLogsOptions(page, size, sort, query, vehicleId)),
    component: RepairLogs
});
