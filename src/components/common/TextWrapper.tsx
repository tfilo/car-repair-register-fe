import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

export const TextGroupWrapper: React.FC<PropsWithChildren<{ columnGap?: number }>> = ({ children, columnGap = 2 }) => {
    return (
        <Box
            component='span'
            display='flex'
            flexWrap='wrap'
            columnGap={columnGap}
        >
            {children}
        </Box>
    );
};

export const TextWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Box
            whiteSpace='nowrap'
            overflow='hidden'
            textOverflow='ellipsis'
            component='span'
        >
            {children}
        </Box>
    );
};
