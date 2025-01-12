import { IconButton } from '@mui/material';
import { PropsWithChildren } from 'react';

type NavBtnProps = {
    title: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    dataCy?: string;
};

const NavBtn: React.FC<PropsWithChildren<NavBtnProps>> = ({ children, title, onClick, dataCy }) => {
    return (
        <IconButton
            color='primary'
            title={title}
            aria-label={title}
            size='large'
            type='button'
            onClick={onClick}
            sx={{
                width: 56,
                height: 56
            }}
            data-cy={dataCy}
        >
            {children}
        </IconButton>
    );
};
export default NavBtn;
