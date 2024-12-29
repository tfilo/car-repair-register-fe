import * as yup from 'yup';

// Definicia typu premenných prostredia
export const envSchema = yup.object({
    API_BASE_PATH: yup.string().defined().required(),
    KEYCLOAK_REALM: yup.string().defined().required(),
    KEYCLOAK_CLIENT: yup.string().defined().required(),
    KEYCLOAK_URL: yup.string().defined().required()
});
