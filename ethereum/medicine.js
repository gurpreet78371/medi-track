import web3 from "./web3";
import Medicine from "./build/Medicine.json";

export default (address) => {
    return new web3.eth.Contract(Medicine.abi, address);
};
