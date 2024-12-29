import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

type TechnicalInfoProps = {
    object: {
        created: string;
        modified: string | null;
    };
};

const TechnicalInfo: React.FC<TechnicalInfoProps> = ({ object: { created, modified } }) => {
    return (
        <Stack>
            <Typography variant='caption'>Vytvorené: {dayjs(created).format('DD.MM.YYYY HH:mm:ss')}</Typography>
            {modified && <Typography variant='caption'>Naposledy upravené: {dayjs(modified).format('DD.MM.YYYY HH:mm:ss')}</Typography>}
        </Stack>
    );
};

export default TechnicalInfo;
