import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { QueryClient } from '@tanstack/react-query';
import { Container } from '@mui/material';
import Navigation from '../components/navigation/Navigation';
import React from 'react';

const TanStackRouterDevtools =
    process.env.NODE_ENV === 'production'
        ? () => null // Render nothing in production
        : React.lazy(() =>
              // Lazy load in development
              import('@tanstack/router-devtools').then((res) => ({
                  default: res.TanStackRouterDevtools
                  // For Embedded Mode
                  // default: res.TanStackRouterDevtoolsPanel
              }))
          );

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
            <TanStackRouterDevtools />
            <ReactQueryDevtools initialIsOpen={false} />
        </Container>
    )
});
