import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.scss';
import App from './App';
import type { AuthProviderProps } from 'react-oidc-context';
import { AuthProvider } from 'react-oidc-context';
import { envSchema } from './envSchema';

// Validácia správnosti premenných prostredia
envSchema.validateSync(window.ENV);

const oidcConfig: AuthProviderProps = {
    authority: window.ENV.KEYCLOAK_URL + '/realms/' + window.ENV.KEYCLOAK_REALM,
    client_id: window.ENV.KEYCLOAK_CLIENT,
    redirect_uri: window.location.href,
    automaticSilentRenew: true,
    onSigninCallback: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const formId = urlParams.get('formId');
        const callback = urlParams.get('callback');
        const preserved = new URLSearchParams();
        if (formId && callback) {
            preserved.set('formId', formId);
            preserved.set('callback', callback);
        }
        const preservedQuery = preserved.toString();
        window.history.replaceState(
            { formId, callback },
            document.title,
            window.location.pathname + (preservedQuery ? '?' + preservedQuery : '')
        );
    }
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
