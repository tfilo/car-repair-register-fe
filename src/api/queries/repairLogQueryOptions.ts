import { queryOptions, useMutation } from '@tanstack/react-query';
import { repairLogApi } from '../api';
import type { RepairLogCreate, RepairLogUpdate } from '../openapi/backend';
import { queryClient } from '../../queryClient';

export const findRepairLogsOptions = (
    page: number = 0,
    size: number = 10,
    sort: Array<string> = ['repairDate,DESC'],
    query?: string,
    vehicleId?: number
) =>
    queryOptions({
        queryKey: ['repairLog', 'find', [page, size, sort, query, vehicleId]] as const,
        queryFn: ({ queryKey, signal }) =>
            repairLogApi.findRepairLogs(queryKey[2][0], queryKey[2][1], queryKey[2][2], queryKey[2][3], queryKey[2][4], { signal })
    });

export const getRepairLogByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ['repairLog', id] as const,
        queryFn: ({ queryKey, signal }) => repairLogApi.getRepairLogById(queryKey[1], { signal })
    });

export const useUpdateRepairLog = () => {
    return useMutation({
        mutationFn: (data: { id: number; repairLog: RepairLogUpdate }) => repairLogApi.updateRepairLog(data.id, data.repairLog),
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};

export const useCreateRepairLog = () => {
    return useMutation({
        mutationFn: (repairLog: RepairLogCreate) => repairLogApi.createRepairLog(repairLog),
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};

export const useDeleteRepairLogById = () => {
    return useMutation({
        mutationFn: (id: number) => repairLogApi.deleteRepairLogById(id),
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};
