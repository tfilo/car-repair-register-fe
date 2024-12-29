import { AddCircle, Person } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { findCustomersOptions } from '../../api/queries/customerQueryOptions';
import { formatCustomerContact, formatCustomerName } from '../../utils/formatterUtil';
import NavBtn from '../common/NavBtn';
import CommonSearch from '../common/CommonSearch';
import { useCallback } from 'react';
import { Customer } from '../../api/openapi/backend';

const ActionBar: React.FC = () => {
    const navigate = useNavigate({ from: '/' });

    return (
        <NavBtn
            title='Pridať zákaznika'
            onClick={() => navigate({ to: '/customer/add' })}
        >
            <AddCircle fontSize='inherit' />
        </NavBtn>
    );
};

const Primary: React.FC<{ customer: Customer }> = ({ customer }) => {
    return (
        <Typography
            overflow='hidden'
            textOverflow='ellipsis'
        >
            {formatCustomerName(customer, true)}
        </Typography>
    );
};

const Customers: React.FC = () => {
    const navigate = useNavigate({ from: '/customer' });
    const { page, size, sort, query } = useSearch({ from: '/customer/' });
    const findCustomers = useSuspenseQuery(findCustomersOptions(page, size, sort, query));

    const navigationHandler = useCallback(
        (id: number) => {
            return () =>
                navigate({
                    to: '/customer/$id',
                    params: {
                        id: `${id}`
                    }
                });
        },
        [navigate]
    );

    return (
        <CommonSearch
            result={findCustomers.data}
            searchHelper='Vyhľadáva podľa mena, priezviska, telefónneho čísla a emailu.'
            query={query}
            actionBar={<ActionBar />}
        >
            {(customer) => ({
                Icon: Person,
                onClick: navigationHandler(customer.id),
                primary: <Primary customer={customer} />,
                secondary: formatCustomerContact(customer)
            })}
        </CommonSearch>
    );
};

export default Customers;
