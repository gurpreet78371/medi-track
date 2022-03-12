import Web3 from 'web3';

// const web3=new Web3(Web3.givenProvider);

let web3;

if(typeof window!=='undefined' && typeof window.web3!=='undefined'){
    web3= new Web3(window.web3.currentProvider);
}
else{
    const provider=new Web3.providers.HttpProvider(
        'https://ropsten.infura.io/v3/400ffba0c85741edaa96c739bcde96a2'
    );
    web3=new Web3(provider);
}

export default web3;