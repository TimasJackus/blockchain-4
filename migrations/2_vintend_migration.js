const Vinted = artifacts.require("Vinted");

module.exports = function(deployer) {
  deployer.deploy(Vinted, { from: '0xCB13533D62578ea2E989f3c5A8Ec9bB67055AFb3', gas: 2000000 });
};
