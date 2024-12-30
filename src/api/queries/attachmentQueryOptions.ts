import { useMutation } from '@tanstack/react-query';
import { attachmentApi } from '../api';
import { queryClient } from '../../queryClient';

export const useUploadAttachment = () => {
    return useMutation({
        mutationFn: (data: { repairLogId: number; multipartFile: Blob }) =>
            attachmentApi.uploadAttachment(data.repairLogId, data.multipartFile),
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};

export const useDeleteAttachmentById = () => {
    return useMutation({
        mutationFn: (id: number) => attachmentApi.deleteAttachmentById(id),
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['repairLog']
            });
        }
    });
};

export const useDownloadAttachmentById = () => {
    return async (id: number) => {
        await attachmentApi
            .downloadAttachmentByIdRaw({
                id
            })
            .then(async (response) => {
                const contentDisposition = response.raw.headers.get('Content-Disposition');
                let filename = 'file';
                if (contentDisposition !== null) {
                    const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = fileNameRegex.exec(contentDisposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
                const blob = await response.value();
                const fileUrl = URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.href = fileUrl;
                tempLink.setAttribute('download', filename);
                tempLink.click();
                URL.revokeObjectURL(fileUrl);
            });
    };
};
