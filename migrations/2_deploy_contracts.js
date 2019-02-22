let signer = "0x6B293a94771f1CaeA34786E68a9038FAdc25C5fF";

var Verification = artifacts.require("./Verification.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Verification, signer);
};