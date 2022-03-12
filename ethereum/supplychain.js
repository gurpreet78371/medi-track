import web3 from './web3';
import SupplyChain from './build/SupplyChain.json';

const instance= new web3.eth.Contract(
    SupplyChain.abi,
    '0x7FEF63699d394F9860831746E9BB1fC7DD1dC651'
);

export default instance;