import { useLocation, useNavigate } from '@tanstack/react-router';
import { useCallback, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const useQuerySearch = () => {
    const searchInput = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const debouncedSearch = useDebouncedCallback((query) => {
        navigate({
            to: location.pathname,
            search: (prev) => ({ ...prev, query })
        });
    }, 1000);

    const onSearchHandler = useCallback(() => {
        const val = searchInput.current?.value ?? '';
        debouncedSearch(val);
        debouncedSearch.flush();
    }, [debouncedSearch, searchInput]);

    return { searchInput, debouncedSearch, onSearchHandler };
};

export default useQuerySearch;
