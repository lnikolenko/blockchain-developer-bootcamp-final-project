const path = require("path");
/*
const HDWalletProvider = require("@truffle/hdwallet-provider");
const dotenv = require("dotenv");
dotenv.config();
const mnemonic = process.env.MNEMONIC;
*/

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      port: 7545,
      network_id: "5777",
    },
    /*
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, process.env.INFURA_URL),
      network_id: 3, // Ropsten's network id
      gas: 5500000,
    },
    */
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
