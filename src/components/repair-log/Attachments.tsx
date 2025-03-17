import { Box, Typography } from '@mui/material';
import { Attachment } from '../../api/openapi/backend';
import FileComponent from '../common/FileComponent';
import { useCallback, useState } from 'react';
import CustomModal from '../common/Modal';
import { useDeleteAttachmentById, useDownloadAttachmentById } from '../../api/queries/attachmentQueryOptions';
import { useRouter } from '@tanstack/react-router';

type AttachmentsProps = {
    attachments: Attachment[];
    readOnly: boolean;
};

const Attachments: React.FC<AttachmentsProps> = ({ attachments, readOnly }) => {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<number | null>(null);
    const deleteAttachmentByIdMutation = useDeleteAttachmentById();
    const downloadAttachmentByIdMutation = useDownloadAttachmentById();
    const [isPending, setIsPending] = useState<Set<number>>(new Set());

    const downloadHandler = useCallback(
        async (id: number) => {
            if (id !== null) {
                try {
                    setIsPending((prev) => {
                        const arr = Array.from(prev);
                        arr.push(id);
                        return new Set(arr);
                    });
                    await downloadAttachmentByIdMutation(id);
                } finally {
                    setIsPending((prev) => {
                        const arr = Array.from(prev).filter((val) => val !== id);
                        return new Set(arr);
                    });
                }
            }
        },
        [downloadAttachmentByIdMutation]
    );

    const deleteHandler = useCallback(async (id: number) => {
        setIsDeleteModalOpen(id);
    }, []);

    const handleCloseDeleteDialog = useCallback(() => {
        setIsDeleteModalOpen(null);
    }, []);

    const onDeleteHandler = useCallback(async () => {
        if (isDeleteModalOpen !== null) {
            await deleteAttachmentByIdMutation.mutateAsync(isDeleteModalOpen);
            router.invalidate();
        }
        setIsDeleteModalOpen(null);
    }, [deleteAttachmentByIdMutation, isDeleteModalOpen, router]);

    return (
        <Box
            display='flex'
            flexDirection='column'
            border='1px solid lightgray'
            borderRadius={1}
            padding={2}
            gap={2}
        >
            <Typography 
            data-cy='attachments-title'>Prílohy: {attachments.length} ks</Typography>
            {attachments.map((a) => (
                <FileComponent
                    fileType={a.mimeType}
                    fileName={a.name}
                    key={a.id}
                    onDownload={readOnly === true ? () => downloadHandler(a.id) : undefined}
                    onDelete={readOnly === false ? () => deleteHandler(a.id) : undefined}
                    isPending={isPending.has(a.id) || isDeleteModalOpen !== null || deleteAttachmentByIdMutation.isPending}
                />
            ))}
            {isDeleteModalOpen && (
                <CustomModal
                    isOpen={isDeleteModalOpen !== null}
                    onConfirm={onDeleteHandler}
                    onAbort={handleCloseDeleteDialog}
                    isPending={deleteAttachmentByIdMutation.isPending}
                    title={'Vymazať prílohu'}
                    body={`Naozaj si prajete natrvalo vymazať prílohu "${attachments.find((a) => a.id === isDeleteModalOpen)?.name}"?`}
                />
            )}
        </Box>
    );
};

export default Attachments;
