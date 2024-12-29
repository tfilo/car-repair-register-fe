import { createRouter, RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { routeTree } from './routeTree.gen';
import { queryClient } from './queryClient';
import { useAuth } from 'react-oidc-context';
import { QueryClientProvider } from '@tanstack/react-query';
import Loader from './components/common/Loader';
import ErrorComponent from './components/common/ErrorComponent';
import NotFound from './components/common/NotFound';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/sk';

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        queryClient: queryClient
    },
    defaultPreload: 'intent',
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: NotFound
});

const App: React.FC = () => {
    const auth = useAuth();

    const { isLoading, activeNavigator, isAuthenticated, signinRedirect } = auth;

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !activeNavigator) {
            signinRedirect();
        }
    }, [isLoading, isAuthenticated, activeNavigator, signinRedirect]);

    return (
        <>
            {isLoading && <Loader />}
            {isAuthenticated && (
                <QueryClientProvider client={queryClient}>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale={'sk'}
                    >
                        <RouterProvider router={router} />
                    </LocalizationProvider>
                </QueryClientProvider>
            )}
        </>
    );
};

export default App;
