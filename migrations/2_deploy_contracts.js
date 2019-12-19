"use strict";

var Vinted = artifacts.require("./Vinted.sol");

module.exports = function(deployer, network, accounts){
  deployer.deploy(Vinted, accounts[1]);
};

