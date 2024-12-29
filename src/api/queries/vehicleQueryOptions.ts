import { queryOptions, useMutation } from '@tanstack/react-query';
import { vehicleApi } from '../api';
import type { VehicleCreate, VehicleUpdate } from '../openapi/backend';
import { queryClient } from '../../queryClient';

export const findVehiclesOptions = (page?: number, size?: number, sort?: Array<string>, query?: string, customerId?: number) =>
    queryOptions({
        queryKey: ['vehicle', 'find', [page, size, sort, query, customerId]] as const,
        queryFn: ({ queryKey, signal }) =>
            vehicleApi.findVehicles(queryKey[2][0], queryKey[2][1], queryKey[2][2], queryKey[2][3], queryKey[2][4], { signal })
    });

export const getVehicleByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ['vehicle', id] as const,
        queryFn: ({ queryKey, signal }) => vehicleApi.getVehicleById(queryKey[1], { signal })
    });

export const useUpdateVehicle = () => {
    return useMutation({
        mutationFn: (data: { id: number; vehicle: VehicleUpdate }) => vehicleApi.updateVehicle(data.id, data.vehicle),
        onSuccess: () => {
            // Vehicle object is inside other objects too so need to clear them
            queryClient.removeQueries({
                queryKey: ['vehicle']
            });
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};

export const useCreateVehicle = () => {
    return useMutation({
        mutationFn: (vehicle: VehicleCreate) => vehicleApi.createVehicle(vehicle),
        onSuccess: () => {
            // Vehicle object is inside other objects too so need to clear them
            queryClient.removeQueries({
                queryKey: ['vehicle']
            });
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};

export const useDeleteVehicleById = () => {
    return useMutation({
        mutationFn: (id: number) => vehicleApi.deleteVehicleById(id),
        onSuccess: () => {
            // Vehicle object is inside other objects too so need to clear them
            queryClient.removeQueries({
                queryKey: ['vehicle']
            });
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};
