import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, FlexboxGrid } from 'rsuite';
import useLocalStorage from '@rehooks/local-storage';

export const Header = () => {
    const history = useHistory();
    const [account, setAccount, deleteAccount] = useLocalStorage('selected-account');

    const logout = () => {
        deleteAccount();
        history.push('/');
    };
  
    return <div className="header">
      <div className="container">
        <FlexboxGrid justify="space-between" align="middle">
          { account ? <h3>{account.address}</h3> : null }
          { account ? <Button color="red" onClick={logout}>Logout</Button> : null}
        </FlexboxGrid>
      </div>
    </div>;
};