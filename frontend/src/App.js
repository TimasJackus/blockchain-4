import React, { Component, useState } from 'react'
import Web3 from 'web3'
import './App.css'
import { VINTED_LIST_ABI, VINTED_CONTRACT_ADDRESS } from './config/config';

export const App = () => {
  const [accounts, setAccounts] = useState(null);
  const web3 = new Web3("ws://localhost:8545");
  const Contract = new web3.eth.Contract(VINTED_LIST_ABI, VINTED_CONTRACT_ADDRESS);
  const loadBlockhainData = async () => {
    if (!accounts) {
      let accounts = await web3.eth.getAccounts();
      accounts = await Promise.all(accounts.map(async (address, id) => {
          let balance = await web3.eth.getBalance(address);
          balance = balance / Math.pow(10, 18);
          return { id, address, balance };
      }));
      setAccounts(accounts);
    }
  };
  
  if (Contract) {
    Contract.events.OrderSent({ fromBlock: 0 }, function(error, event){ console.log(error, event); })
      .once('data', function(event){
          console.log('d:', event); // same results as the optional callback above
      })
      .once('changed', function(event){
        console.log('c:', event)
          // remove event from local database
      })
      .once('error', console.error);
  }

  if (accounts) {
    console.log({ Contract });
    const test = async () => {
      // const test = await Contract.methods.serviceProvider().call();
      // console.log({ test });
      const orderRes = await Contract.methods.sendOrder(accounts[1].address, "ass").send({ from: accounts[0].address });
      console.log(orderRes);
      // const response = await Contract.methods.sendPrice(1, 100, 100, 100).send({ from: accounts[1].address });
      // console.log(response);
    };
    test();
  }

  loadBlockhainData();

  return (
    <div className="container">
      <h1>Hello, World!</h1>
      <p>Your account: {accounts ? accounts[4].address : null}<br />{accounts ? accounts[4].balance : null} ETH</p>
    </div>
  );
}

export default App;