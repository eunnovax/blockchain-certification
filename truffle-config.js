// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
// };

require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');


var mnemonic =
  "12 WORDS PROVIDED BY METAMASK";

module.exports = {
  networks: {
    //development: {
    //  host: "127.0.0.1",
    //  port: 7545,
    //  network_id: "*" // Match any network id
    //},

    development: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          'https://ropsten.infura.io/v3/<INFURA API>'
        )
      },
      gas: 5000000,
      gasPrice: 10000000000,
      network_id: "*"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
