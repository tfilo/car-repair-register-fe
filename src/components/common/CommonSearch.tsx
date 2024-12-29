import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, SvgIconTypeMap } from '@mui/material';
import { Fragment, ReactElement, ReactNode } from 'react';
import { PageMetadata } from '../../api/openapi/backend';
import Pagination from './Pagination';
import QuerySearchField from './QuerySearchField';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type CommonSearchProps<T extends { id: number }> = {
    query?: string;
    searchHelper?: string;
    actionBar?: ReactNode;
    result: {
        content?: T[];
        page?: PageMetadata;
    };
    children: (item: T) => {
        primary: ReactNode;
        secondary: ReactNode;
        onClick: React.MouseEventHandler<HTMLLIElement> | undefined;
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
            muiName: string;
        };
    };
};

type CommonSearchComponent = <T extends { id: number }>(props: CommonSearchProps<T>) => ReactElement | null;

const CommonSearch: CommonSearchComponent = ({ children, query, result, searchHelper, actionBar }) => {
    return (
        <Box
            display='flex'
            flexDirection='column'
            gap={2}
            marginBottom={8}
        >
            <Box
                display='flex'
                flexDirection='row'
                justifyItems={'start'}
            >
                <QuerySearchField
                    query={query}
                    helperText={searchHelper}
                />
                {actionBar}
            </Box>
            <List sx={{ width: '100%' }}>
                {result.content?.map((el, idx, arr) => {
                    const { Icon, ...currentItem } = children(el);
                    return (
                        <Fragment key={el.id}>
                            <ListItem
                                alignItems='flex-start'
                                disableGutters
                                onClick={currentItem.onClick}
                                sx={{
                                    cursor: 'pointer'
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <Icon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={currentItem.primary}
                                    secondary={currentItem.secondary}
                                />
                            </ListItem>
                            {arr.length - 1 !== idx && <Divider component='li' />}
                        </Fragment>
                    );
                })}
            </List>
            <Pagination pageMetadata={result.page} />
        </Box>
    );
};
export default CommonSearch;
