import { User } from 'oidc-client-ts';
import {
    AttachmentApi,
    Configuration,
    CustomerApi,
    RepairLogApi,
    VehicleApi,
    type ErrorContext,
    type ErrorMessage,
    type ResponseContext
} from './openapi/backend';

export const getUser = () => {
    const oidcStorage = sessionStorage.getItem(
        `oidc.user:${window.ENV.KEYCLOAK_URL}/realms/${window.ENV.KEYCLOAK_REALM}:${window.ENV.KEYCLOAK_CLIENT}`
    );
    if (!oidcStorage) {
        return null;
    }

    return User.fromStorageString(oidcStorage);
};

export const getAccessToken = () => {
    const user = getUser();
    return user?.access_token ?? '';
};

const apiConfig = new Configuration({
    basePath: window.ENV.API_BASE_PATH,
    accessToken: () => {
        return getAccessToken();
    },
    middleware: [
        {
            post(context: ResponseContext): Promise<Response | void> {
                const promise = new Promise<Response | void>((resolve, reject) => {
                    if (!context.response.ok) {
                        context.response
                            .json()
                            .then((value: ErrorMessage) => {
                                return reject(value);
                            })
                            .catch((e) => {
                                return reject(e);
                            });
                    } else {
                        return resolve(context.response);
                    }
                });
                return promise;
            },
            onError(context: ErrorContext): Promise<Response | void> {
                return Promise.reject(context.error);
            }
        }
    ]
});

export const customerApi = new CustomerApi(apiConfig);
export const vehicleApi = new VehicleApi(apiConfig);
export const repairLogApi = new RepairLogApi(apiConfig);
export const attachmentApi = new AttachmentApi(apiConfig);
