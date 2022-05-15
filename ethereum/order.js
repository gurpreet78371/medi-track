import web3 from "./web3";
import Order from "./build/Order.json";

export default (address) => {
    return new web3.eth.Contract(Order.abi, address);
};
