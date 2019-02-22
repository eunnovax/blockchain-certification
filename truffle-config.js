// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
// };

require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');


var mnemonic =
  "brown grit awful puppy crouch picnic annual street also rich business marriage";

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
          'https://ropsten.infura.io/v3/519cb9af0a8c492db7f79f4605059a74'
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