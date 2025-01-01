import * as yup from 'yup';
import { NumberSchema, StringSchema } from 'yup';
import { sk } from 'yup-locales';

yup.setLocale(sk);

yup.addMethod(StringSchema, 'emptyAsNull', function () {
    return this.transform((val) => (val === '' ? null : val)).default(null);
});

yup.addMethod(NumberSchema, 'emptyAsNull', function () {
    return this.transform((val, oVal) => (oVal === '' ? null : val)).default(null);
});

export default yup;
