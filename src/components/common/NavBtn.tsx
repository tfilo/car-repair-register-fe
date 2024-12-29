import { IconButton } from '@mui/material';
import { PropsWithChildren } from 'react';

type NavBtnProps = {
    title: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const NavBtn: React.FC<PropsWithChildren<NavBtnProps>> = ({ children, title, onClick }) => {
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
        >
            {children}
        </IconButton>
    );
};
export default NavBtn;
