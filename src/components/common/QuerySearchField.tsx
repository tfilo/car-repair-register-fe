import { Search } from '@mui/icons-material';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useId } from 'react';
import useQuerySearch from '../../hooks/useQuerySearch';
import { isNotBlankString } from '../../utils/typeGuardUtil';

type QuerySearchFieldProps = {
    query: string | undefined;
    helperText?: string;
};

const QuerySearchField: React.FC<QuerySearchFieldProps> = ({ query, helperText }) => {
    const uniqueId = useId();
    const { searchInput, debouncedSearch, onSearchHandler } = useQuerySearch();
    const hasHelperText = isNotBlankString(helperText);

    return (
        <FormControl
            fullWidth
            variant='outlined'
        >
            <InputLabel htmlFor={`${uniqueId}_search-query`}>Vyhľadať</InputLabel>
            <OutlinedInput
                inputRef={searchInput}
                id={`${uniqueId}_search-query`}
                aria-describedby={hasHelperText ? `${uniqueId}_search-query-helper` : undefined}
                type='text'
                endAdornment={
                    <InputAdornment position='end'>
                        <IconButton
                            title='Vyhľadať'
                            onClick={onSearchHandler}
                            edge='end'
                            type='button'
                        >
                            <Search />
                        </IconButton>
                    </InputAdornment>
                }
                label='Vyhľadať'
                defaultValue={query ?? ''}
                onChange={(e) => debouncedSearch(e.target.value)}
            />
            {hasHelperText && <FormHelperText id={`${uniqueId}_search-query-helper`}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default QuerySearchField;
