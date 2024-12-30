import { Box } from '@mui/material';

const Loader: React.FC = () => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            Načítava sa
        </Box>
    );
};

export default Loader;
