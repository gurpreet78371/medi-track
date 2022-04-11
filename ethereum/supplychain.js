import web3 from './web3';
import SupplyChain from './build/SupplyChain.json';

const instance= new web3.eth.Contract(
    SupplyChain.abi,
    '0x395967e03643C41336dde4B92c305754A7829C8f'
);

export default instance;