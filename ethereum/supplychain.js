import web3 from './web3';
import SupplyChain from './build/SupplyChain.json';

const instance= new web3.eth.Contract(
    SupplyChain.abi,
    '0xcFbF4ac013Fa5609C9348BF614C17431d3688a12'
);

export default instance;