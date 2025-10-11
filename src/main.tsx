import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.scss';
import App from './App';
import type { AuthProviderProps } from 'react-oidc-context';
import { AuthProvider } from 'react-oidc-context';
import { envSchema } from './envSchema';

// Remove search from redirect uri
const redirectUri = new URL(window.location.href);
redirectUri.search = '';

// Validation of environment variables
envSchema.validateSync(window.ENV);

const isDeveloperMode = import.meta.env.MODE === 'development';

const oidcConfig: AuthProviderProps = {
    authority: window.ENV.KEYCLOAK_URL + '/realms/' + window.ENV.KEYCLOAK_REALM,
    client_id: window.ENV.KEYCLOAK_CLIENT,
    redirect_uri: redirectUri.toString(),
    automaticSilentRenew: true,
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    },
    monitorSession: !isDeveloperMode,
    monitorAnonymousSession: !isDeveloperMode
};

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
    createRoot(rootElement).render(
        <AuthProvider {...oidcConfig}>
            <StrictMode>
                <App />
            </StrictMode>
        </AuthProvider>
    );
}
