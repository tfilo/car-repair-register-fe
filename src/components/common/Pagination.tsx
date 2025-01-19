import { useCallback, useId } from 'react';
import { PageMetadata } from '../../api/openapi/backend';
import { isPagination } from '../../utils/typeGuardUtil';
import { Box, FormControl, InputLabel, MenuItem, Pagination as MuiPagination, Select, SelectChangeEvent } from '@mui/material';
import { useLocation, useNavigate } from '@tanstack/react-router';

type PaginationProp = {
    pageMetadata: PageMetadata | undefined;
};

const Pagination: React.FC<PaginationProp> = ({ pageMetadata }) => {
    const uniqueId = useId();
    const location = useLocation();
    const navigate = useNavigate();

    const pageChangeHandler = useCallback(
        (_: React.ChangeEvent<unknown>, page: number) => {
            navigate({
                to: location.pathname,
                search: (prev) => ({ ...prev, page: page - 1 })
            });
        },
        [location.pathname, navigate]
    );

    const sizeChangeHandler = useCallback(
        (pageSize: SelectChangeEvent<number>) => {
            const size = +pageSize.target.value;
            navigate({
                to: location.pathname,
                search: (prev) => ({ ...prev, size })
            });
        },
        [location.pathname, navigate]
    );

    if (!isPagination(pageMetadata)) {
        return null;
    }

    return (
        <Box
            display='flex'
            justifyContent='space-between'
            alignItems='end'
            gap={4}
            sx={{
                flexDirection: {
                    xs: 'column',
                    sm: 'row'
                }
            }}
        >
            <MuiPagination
                count={pageMetadata.totalPages}
                page={(pageMetadata.number ?? 0) + 1}
                shape='rounded'
                onChange={pageChangeHandler}
                data-cy='pagination'
            />
            <FormControl
                sx={{ width: '8rem' }}
                variant='standard'
            >
                <InputLabel htmlFor={`${uniqueId}_page-size`}>Počet na stranu</InputLabel>
                <Select
                    id={`${uniqueId}_page-size`}
                    value={pageMetadata.size}
                    label='Počet na stranu'
                    onChange={sizeChangeHandler}
                    data-cy='page-size'
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default Pagination;
