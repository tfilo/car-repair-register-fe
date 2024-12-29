import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { useId } from 'react';

type CustomModalProsp = {
    isOpen: boolean;
    onConfirm: () => void;
    onAbort: () => void;
    isPending: boolean;
    title: string;
    body: string;
};

const CustomModal: React.FC<CustomModalProsp> = ({ isOpen, onConfirm, onAbort, isPending, title, body }) => {
    const id = useId();

    return (
        <Modal
            open={isOpen}
            onClose={onAbort}
            aria-labelledby={`${id}_modal-modal-title`}
            aria-describedby={`${id}_modal-modal-description`}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    maxWidth: '90vw',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    boxSizing: 'border-box'
                }}
            >
                <Typography
                    id={`${id}_modal-modal-title`}
                    variant='h6'
                    component='h2'
                >
                    {title}
                </Typography>
                <Typography
                    id={`${id}_modal-modal-description`}
                    sx={{ mt: 2 }}
                >
                    {body}
                </Typography>
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    paddingTop={4}
                >
                    <Button
                        color='primary'
                        variant='outlined'
                        type='button'
                        onClick={onAbort}
                        disabled={isPending}
                    >
                        Ponechať
                    </Button>
                    <Button
                        color='error'
                        variant='outlined'
                        type='button'
                        onClick={onConfirm}
                        disabled={isPending}
                    >
                        Vymazať
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default CustomModal;