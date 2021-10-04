var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var CryptoUnion = artifacts.require("./CryptoUnion.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(CryptoUnion);
};
