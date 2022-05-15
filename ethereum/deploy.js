const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledContract = require("./build/SupplyChain.json");

const provider = new HDWalletProvider(
    "can rate hover zoo target annual peasant embark envelope powder increase safe",
    "https://ropsten.infura.io/v3/400ffba0c85741edaa96c739bcde96a2"
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account ", accounts[0]);
    const supplyChain = await new web3.eth.Contract(compiledContract.abi)
        .deploy({ data: compiledContract.evm.bytecode.object })
        .send({ from: accounts[0], gas: "8000000" })
        .catch(console.log);
    console.log(supplyChain);
    console.log("Contract deployed to: ", supplyChain.options.address);
    provider.engine.stop();
};
deploy();
// 0x085a301b40Ca86686B3d2f0EB148114e8165c1a9
// 0x7FEF63699d394F9860831746E9BB1fC7DD1dC651
// 0x395967e03643C41336dde4B92c305754A7829C8f
// 0xcFbF4ac013Fa5609C9348BF614C17431d3688a12