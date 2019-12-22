import React, { Component, useState } from 'react';
// import './App.css'
import 'rsuite/dist/styles/rsuite-default.css';
import { List, FlexboxGrid, Button } from 'rsuite';
import { useHistory } from 'react-router-dom';
import useLocalStorage from '@rehooks/local-storage';

export const ListView = ({ accounts }) => {
    const history = useHistory();
    const [account, setAccount] = useLocalStorage('selected-account');

    const handleClick = (account) => () => {
        setAccount(account);
        if (account.role === 'BUYER') {
            history.push('/products');
        } else if (account.role === 'SELLER') {
            history.push('/orders');
        } else if (account.role === 'COURIER') {
            history.push('/invoices');
        }
    };


    return (
        <div className="container">
        <h3>Select your account</h3><br />
        <List bordered={true}>
            { accounts && accounts.map((account, i) => (
            <List.Item key={i} index={i}>
                <FlexboxGrid justify="space-between" align="middle">
                    <FlexboxGrid.Item>
                        {account.id}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                        {account.address}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                        {account.role}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                        {account.balance} ETH
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                        <Button color="blue" onClick={handleClick(account)} disabled={account.role === 'SERVICE_PROVIDER'}>Select</Button> 
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </List.Item>
            ))}
        </List>
        </div>
    );
};