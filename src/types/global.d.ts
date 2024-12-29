import * as yup from 'yup';
import { envSchema } from '../envSchema';

type Env = Readonly<yup.InferType<typeof envSchema>>;

declare global {
    interface Window {
        ENV: Env;
    }
}
export {};
