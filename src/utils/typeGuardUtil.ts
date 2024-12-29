import { PageMetadata } from '../api/openapi/backend';

export const isPagination = (pm?: PageMetadata): pm is PageMetadata => {
    if (!!pm && pm.totalElements !== undefined && pm.totalElements > 0) {
        return true;
    }
    return false;
};

export const isNotBlankString = (s?: string | null): s is string => {
    if (s !== undefined && s !== null && typeof s === 'string' && s.trim() !== '') {
        return true;
    }

    return false;
};
