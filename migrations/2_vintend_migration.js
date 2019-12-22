const Vinted = artifacts.require("Vinted");

module.exports = function(deployer) {
  deployer.deploy(Vinted);
};
