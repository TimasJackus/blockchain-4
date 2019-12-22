import React, { Component, useState, createContext } from 'react'
import Web3 from 'web3'
import './App.css'
import 'rsuite/dist/styles/rsuite-default.css';
import { VINTED_LIST_ABI, VINTED_CONTRACT_ADDRESS } from './config/config';
import { ListView } from './containers/ListView';
import { Switch, Route, Router, BrowserRouter, useHistory, Redirect } from 'react-router-dom';
import { ProductListView } from './containers/ProductListView';
import { OrderListView } from './containers/OrderListView';
import { Header } from './components/Header';
import { useLocalStorage } from '@rehooks/local-storage';
import { InvoicesListView } from './containers/InvoicesListView';

const roles = [
  { id: 0, name: 'SERVICE_PROVIDER' },
  { id: 1, name: 'SELLER' },
  { id: 2, name: 'COURIER' },
  { id: 3, name: 'BUYER' }
];

const getRoleNameById = (id) => {
  if (id === 0) {
    return roles[0].name;
  }

  const index = (id % 3) + 1;
  return roles[index].name;
};

const BlockchainContext = createContext({
  web3: null,
  contract: null,
  accounts: []
});

const BlockchainConsumer = (Component) => (
  <BlockchainContext.Consumer>
    {value => <Component {...value} />}
  </BlockchainContext.Consumer>
);

const App = () => {
  const [accounts, setAccounts] = useState(null);
  const [account] = useLocalStorage('selected-account');
  const web3 = new Web3("ws://localhost:8545");
  const Contract = new web3.eth.Contract(VINTED_LIST_ABI, VINTED_CONTRACT_ADDRESS);
  const ListViewConstant = BlockchainConsumer(ListView);

  const loadBlockchainData = async () => {
    let accounts = await web3.eth.getAccounts();
    accounts = await Promise.all(accounts.map(async (address, id) => {
        let balance = await web3.eth.getBalance(address);
        balance = (balance / Math.pow(10, 18)).toFixed(4);
        const role = getRoleNameById(id);
        return { id, address, balance, role };
    }));
    setAccounts(accounts);
  };

  if (!accounts) {
    loadBlockchainData();
  }

  const AuthRoute = ({ path, component }) => {
    if (!account) {
      return null;
    }
    if (path === '/products' && account.role !== 'BUYER') {
      return null;
    }
    if (path === '/orders' && account.role !== 'SELLER') {
      return null;
    }
    if (path === '/invoices' && account.role !== 'COURIER') {
      return null;
    }
    return <Route path={path}>{BlockchainConsumer(component)}</Route>;
  };
  

  const BlockchainContextValue = {
    web3: web3,
    contract: Contract,
    accounts: accounts,
    loadBlockchainData
  };

  return (
    <BlockchainContext.Provider value={BlockchainContextValue}>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/">
            {ListViewConstant}
          </Route>
          {AuthRoute({ path: '/products', component: ProductListView })}
          {AuthRoute({ path: '/orders', component: OrderListView })}
          {AuthRoute({ path: '/invoices', component: InvoicesListView })}
          <Redirect to="/" /> 
        </Switch>
      </BrowserRouter>
    </BlockchainContext.Provider>
  );
}

export default App;