import { queryOptions, useMutation } from '@tanstack/react-query';
import { customerApi } from '../api';
import type { CustomerCreate, CustomerUpdate } from '../openapi/backend';
import { queryClient } from '../../queryClient';

export const findCustomersOptions = (
    page: number = 0,
    size: number = 25,
    sort: Array<string> = ['name,ASC', 'surname,DESC'],
    query?: string
) =>
    queryOptions({
        queryKey: ['customer', 'find', [page, size, sort, query]] as const,
        queryFn: ({ queryKey, signal }) =>
            customerApi.findCustomers(queryKey[2][0], queryKey[2][1], queryKey[2][2], queryKey[2][3], { signal })
    });

export const getCustomerByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ['customer', id] as const,
        queryFn: ({ queryKey, signal }) => customerApi.getCustomerById(queryKey[1], { signal })
    });

export const useUpdateCustomer = () => {
    return useMutation({
        mutationFn: (data: { id: number; customer: CustomerUpdate }) => customerApi.updateCustomer(data.id, data.customer),
        onSuccess: () => {
            // Customer object is inside other objects too so clear cache completly
            queryClient.removeQueries({
                queryKey: ['customer']
            });
            queryClient.removeQueries({
                queryKey: ['vehicle']
            });
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};

export const useCreateCustomer = () => {
    return useMutation({
        mutationFn: (customer: CustomerCreate) => customerApi.createCustomer(customer),
        onSuccess: () => {
            // Customer object is inside other objects too so clear cache completly
            queryClient.removeQueries({
                queryKey: ['customer']
            });
            queryClient.removeQueries({
                queryKey: ['vehicle']
            });
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};

export const useDeleteCustomerById = () => {
    return useMutation({
        mutationFn: (id: number) => customerApi.deleteCustomerById(id),
        onSuccess: () => {
            // Customer object is inside other objects too so clear cache completly
            queryClient.removeQueries({
                queryKey: ['customer']
            });
            queryClient.removeQueries({
                queryKey: ['vehicle']
            });
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};
