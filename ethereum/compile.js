const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath=path.resolve(__dirname,'build');
fs.removeSync(buildPath);

const contractsPath = path.resolve(__dirname, "contracts");
const sources = {};
const contractFiles=fs.readdirSync(contractsPath);

contractFiles.forEach(file => {
    const contractFullPath=path.resolve(contractsPath,file);
    sources[file]={
        content: fs.readFileSync(contractFullPath,'utf8')
    };
});


fs.ensureDirSync(buildPath);

var input = {
    language: "Solidity",
    sources: sources,
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi","evm.bytecode"],
            },
        },
    },
};
compiledContracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts;
console.log(compiledContracts);
for(let contract in compiledContracts){
    for(let contractName in compiledContracts[contract]){
        fs.outputJSONSync(
            path.resolve(buildPath,contractName+'.json'),
            compiledContracts[contract][contractName]
        );
    }
    
}

