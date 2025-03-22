import React from 'react';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import type { QueryClient } from '@tanstack/react-query';
import { Container } from '@mui/material';
import Navigation from '../components/navigation/Navigation';

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    component: () => (
        <Container
            maxWidth='md'
            disableGutters
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <Navigation />
            <Container
                maxWidth='md'
                component='main'
                sx={{
                    flex: '1',
                    marginY: '24px'
                }}
            >
                <Outlet />
            </Container>
            <TanStackRouterDevtools initialIsOpen={false} />
            <ReactQueryDevtools initialIsOpen={false} />
        </Container>
    )
});
