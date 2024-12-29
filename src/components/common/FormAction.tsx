import { ArrowBack, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback, useState } from 'react';
import CustomModal from './Modal';

type FormActionProps = {
    canSubmit: boolean;
    isPending: boolean;
    readOnly: boolean;
    setReadOnly: (readOnly: boolean) => void;
    onBackHandler: () => void;
    onDeleteHandler: () => void;
    allowDelete: boolean;
    deleteModal: {
        title: string;
        body: string;
    };
};

const FormAction: React.FC<FormActionProps> = ({
    canSubmit,
    isPending,
    onBackHandler,
    onDeleteHandler,
    setReadOnly,
    readOnly,
    allowDelete,
    deleteModal
}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleOpenDeleteDialog = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    const handleCloseDeleteDialog = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, []);

    return (
        <>
            {readOnly === false && allowDelete ? (
                <Button
                    startIcon={<Cancel />}
                    variant='contained'
                    type='button'
                    color='inherit'
                    onClick={() => setReadOnly(true)}
                    sx={{ height: 48 }}
                    disabled={isPending}
                >
                    Zrušiť
                </Button>
            ) : (
                <Button
                    startIcon={<ArrowBack />}
                    variant='contained'
                    type='button'
                    color='inherit'
                    onClick={onBackHandler}
                    sx={{ height: 48 }}
                    disabled={isPending}
                >
                    Späť
                </Button>
            )}

            {readOnly === false ? (
                <>
                    {allowDelete && (
                        <Button
                            startIcon={<Delete />}
                            variant='contained'
                            type='button'
                            color='error'
                            onClick={handleOpenDeleteDialog}
                            sx={{ height: 48 }}
                            disabled={isPending}
                        >
                            Odstrániť
                        </Button>
                    )}
                    <Button
                        startIcon={<Save />}
                        variant='contained'
                        color='success'
                        type='submit'
                        sx={{ height: 48 }}
                        disabled={!canSubmit || isPending}
                    >
                        {isPending ? 'Ukladám' : 'Uložiť'}
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        startIcon={<Edit />}
                        variant='contained'
                        type='button'
                        sx={{ height: 48 }}
                        onClick={() => setReadOnly(false)}
                    >
                        Upraviť
                    </Button>
                </>
            )}
            {isDeleteModalOpen && (
                <CustomModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={onDeleteHandler}
                    onAbort={handleCloseDeleteDialog}
                    isPending={isPending}
                    title={deleteModal.title}
                    body={deleteModal.body}
                />
            )}
        </>
    );
};

export default FormAction;
