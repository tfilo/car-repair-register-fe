import { Link as RouterLink, useLocation } from '@tanstack/react-router';
import { Box, Breadcrumbs, Button, Container, IconButton, Link, Typography } from '@mui/material';
import { AccountCircle, LogoutOutlined } from '@mui/icons-material';
import { useAuth } from 'react-oidc-context';

const PATH_BUNDLE: { [key: string]: string } = {
    '': 'Domov',
    customer: 'Zákazník',
    vehicle: 'Vozidlo',
    'repair-log': 'Záznam',
    add: 'Nový záznam'
};

const resolveBreadcrumbBundle = (idx: number, array: string[]) => {
    if (idx > 0 && array[idx - 1] === 'customer') {
        if (array[idx] !== 'add') {
            return 'Detail zákazníka';
        }
    }
    if (idx > 0 && array[idx - 1] === 'vehicle') {
        if (array[idx] !== 'add') {
            return 'Detail vozidla';
        }
    }
    if (idx > 0 && array[idx - 1] === '') {
        if (!isNaN(+array[idx])) {
            return 'Detail záznamu opravy';
        }
    }

    return PATH_BUNDLE[array[idx]] ?? array[idx];
};

const Navigation: React.FC = () => {
    const location = useLocation();
    const { signoutRedirect } = useAuth();

    const pathname = location.pathname.trim().endsWith('/')
        ? location.pathname.trim().substring(0, location.pathname.trim().length - 1)
        : location.pathname.trim();

    return (
        <Container
            maxWidth='md'
            component='nav'
            sx={{
                paddingY: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid lightgray'
            }}
        >
            <Breadcrumbs aria-label='navigácia'>
                {pathname.split('/').map((path, idx, array) => {
                    let subpath = array
                        .slice(0, idx + 1)
                        .join('/')
                        .trim();
                    if (subpath === '') {
                        subpath = '/';
                    }
                    return array.length - 1 === idx ? (
                        <Typography
                            key={subpath}
                            color='textSecondary'
                        >
                            {resolveBreadcrumbBundle(idx, array)}
                        </Typography>
                    ) : (
                        <Link
                            key={subpath}
                            underline='hover'
                            color='primary'
                            to={subpath}
                            component={RouterLink}
                        >
                            {resolveBreadcrumbBundle(idx, array)}
                        </Link>
                    );
                })}
            </Breadcrumbs>
            <Box
                display='flex'
                gap={2}
            >
                <Button
                    startIcon={<AccountCircle />}
                    variant='text'
                    color='primary'
                    onClick={() =>
                        (window.location.href =
                            window.ENV.KEYCLOAK_URL +
                            '/realms/' +
                            window.ENV.KEYCLOAK_REALM +
                            '/account?referrer=' +
                            window.ENV.KEYCLOAK_CLIENT +
                            '&referrer_uri=' +
                            window.location.href)
                    }
                    sx={{
                        display: {
                            xs: 'none',
                            sm: 'flex'
                        }
                    }}
                >
                    Profil
                </Button>
                <Button
                    startIcon={<LogoutOutlined />}
                    variant='text'
                    color='primary'
                    onClick={() =>
                        signoutRedirect({
                            post_logout_redirect_uri: window.location.origin
                        })
                    }
                    sx={{
                        display: {
                            xs: 'none',
                            sm: 'flex'
                        }
                    }}
                >
                    Odhlásiť sa
                </Button>
                <IconButton
                    title='Profil'
                    color='primary'
                    onClick={() =>
                        (window.location.href =
                            window.ENV.KEYCLOAK_URL +
                            '/realms/' +
                            window.ENV.KEYCLOAK_REALM +
                            '/account?referrer=' +
                            window.ENV.KEYCLOAK_CLIENT +
                            '&referrer_uri=' +
                            window.location.href)
                    }
                    sx={{
                        display: {
                            sm: 'none',
                            xs: 'flex'
                        }
                    }}
                >
                    <AccountCircle />
                </IconButton>
                <IconButton
                    title='Odhlásiť sa'
                    color='primary'
                    onClick={() =>
                        signoutRedirect({
                            post_logout_redirect_uri: window.location.origin
                        })
                    }
                    sx={{
                        display: {
                            sm: 'none',
                            xs: 'flex'
                        }
                    }}
                >
                    <LogoutOutlined />
                </IconButton>
            </Box>
        </Container>
    );
};

export default Navigation;
