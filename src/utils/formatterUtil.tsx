import { Customer, Vehicle } from '../api/openapi/backend';
import { ReactNode } from 'react';
import { TextGroupWrapper, TextWrapper } from '../components/common/TextWrapper';
import { isNotBlankString } from './typeGuardUtil';

const CUSTOMER_PREFIX = 'Zákazník:';
const PHONE_PREFIX = 'Telefón:';
const EMAIL_PREFIX = 'Email:';
const REG_PLATE_PREFIX = 'EČ:';
const VIN_PREFIX = 'VIN:';
const ENGINE_CODE_PREFIX = 'Kód motora:';

export const formatCustomerNameAsString = (c: Customer): string => {
    const result: string[] = [];

    if (isNotBlankString(c.name)) {
        result.push(c.name);
    }
    if (isNotBlankString(c.surname)) {
        result.push(c.surname);
    }

    return result.join(' ');
};

export const formatCustomerName = (c: Customer, hidePrefix: boolean = false): ReactNode => {
    const result: ReactNode[] = [];

    if (isNotBlankString(c.name)) {
        result.push(<TextWrapper key='name'>{c.name}</TextWrapper>);
    }
    if (isNotBlankString(c.surname)) {
        result.push(<TextWrapper key='surname'>{c.surname}</TextWrapper>);
    }

    return (
        <TextGroupWrapper columnGap={0.5}>
            {hidePrefix === false && <TextWrapper key='prefix'>{CUSTOMER_PREFIX}</TextWrapper>}
            {result}
        </TextGroupWrapper>
    );
};

export const formatCustomerContact = (c: Customer): ReactNode => {
    const result: ReactNode[] = [];

    if (isNotBlankString(c.mobile)) {
        result.push(
            <TextWrapper key='phone'>
                {PHONE_PREFIX} {c.mobile}
            </TextWrapper>
        );
    }
    if (isNotBlankString(c.email)) {
        result.push(
            <TextWrapper key='email'>
                {EMAIL_PREFIX} {c.email}
            </TextWrapper>
        );
    }

    if (result.length === 0) {
        return null;
    }

    return <TextGroupWrapper>{result}</TextGroupWrapper>;
};

export const formatVehicleMainDetail = (v: Vehicle, hidePrefix: boolean = false): ReactNode => {
    const result: ReactNode[] = [];

    if (isNotBlankString(v.registrationPlate)) {
        result.push(
            <TextWrapper key='registrationPlate'>
                {hidePrefix === false ? REG_PLATE_PREFIX + ' ' : ''}
                {v.registrationPlate}
            </TextWrapper>
        );
    }

    if (isNotBlankString(v.brand) || isNotBlankString(v.model)) {
        if (result.length === 1) {
            result.push(<TextWrapper key='dash'>-</TextWrapper>);
        }
        if (isNotBlankString(v.brand)) {
            result.push(<TextWrapper key='brand'>{v.brand}</TextWrapper>);
        }
        if (isNotBlankString(v.model)) {
            result.push(<TextWrapper key='model'>{v.model}</TextWrapper>);
        }
    }

    return <TextGroupWrapper columnGap={0.5}>{result}</TextGroupWrapper>;
};

export const formatVehicleSecondaryDetail = (v: Vehicle): ReactNode | null => {
    const result: ReactNode[] = [];

    if (isNotBlankString(v.vin)) {
        result.push(
            <TextWrapper key='vin'>
                {VIN_PREFIX} {v.vin}
            </TextWrapper>
        );
    }
    if (isNotBlankString(v.engineCode)) {
        result.push(
            <TextWrapper key='engineCode'>
                {ENGINE_CODE_PREFIX} {v.engineCode}
            </TextWrapper>
        );
    }

    if (result.length === 0) {
        return null;
    }
    return <TextGroupWrapper>{result}</TextGroupWrapper>;
};

export const fileSizeFormatter = (size: number): string => {
    if (size < 500) {
        return `${size} B`;
    }

    if (size < 1000000) {
        return `${(size / 1024).toFixed(2)} kB`;
    }

    return `${(size / 1024 / 1024).toFixed(2)} MB`;
};
