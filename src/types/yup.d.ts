declare module 'yup' {
    interface StringSchema {
        emptyAsNull(): StringSchema<string, AnyObject, null>;
    }
    interface NumberSchema {
        emptyAsNull(): NumberSchema<number, AnyObject, null>;
    }
}

export {};
