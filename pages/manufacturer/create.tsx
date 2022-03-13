import React from "react";
import supplychain from "../../ethereum/supplychain";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import web3 from "../../ethereum/web3";

export default function register() {
    const [address,setAddress]=useState('');
    const [formvalues, setformvalues] = useState({
        name: "",
        quantity: "",
        shipper: "",
        receiver: "",
        expiry: "",
    });
    const links = [
        { name: "Batches", address: "/manufacturer", active: false },
        { name: "Create", address: "#", active: true },
      ];

    useEffect(async ()=>{
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const account = web3.utils.toChecksumAddress(accounts[0]);
        const info=await supplychain.methods.getUserInfo(account).call();
        if(info.role!=2){
            console.log('You are not manufacturer!!!');
        }
        else{
            console.log('You are manufacturer!!!');
            setAddress(account);
        }
    })
    const manufacture = async (event) => {
        event.preventDefault();
        console.log(formvalues.name);
        console.log(formvalues.quantity);
        console.log(formvalues.shipper);
        console.log(formvalues.receiver);
        console.log(formvalues.expiry);
        // await supplychain.methods
        //     .manufactureMedicine(
        //         formvalues.name,
        //         parseInt(formvalues.quantity),
        //         formvalues.shipper,
        //         formvalues.receiver,
        //         formvalues.expiry
        //     )
        //     .send({
        //         from: account,
        //     });
    };
  return (
    <div className="register">
      <NavBar links={links}></NavBar>
      <form className="register-form" onSubmit={manufacture}>
        <div className="container">
          <h2>Create Batch</h2>
          <p>Please fill in this form to register a batch.</p>
          <label htmlFor="name">
            <b>Name</b>
          </label>
          <input
            type="text"
            name="name"
            value={formvalues.name}
            onChange={(event) => {
              setformvalues({ ...formvalues, name: event.target.value });
            }}
            placeholder="Enter Medicine Name"
            required
          />
          <label htmlFor="quntity">
            <b>Ethereum Address</b>
          </label>
          <input
            type="number"
            placeholder="Enter quantity in this batch"
            name="quantity"
            value={formvalues.quantity}
            onChange={(event) => {
              setformvalues({ ...formvalues, quantity: event.target.value });
            }}
            required
          />
          <label htmlFor="shipper">
            <b>Shipper's Ethereum Address</b>
          </label>
          <input
            type="text"
            placeholder="Enter Shipper's Ethereum Address"
            name="shipper"
            value={formvalues.shipper}
            onChange={(event) => {
              setformvalues({ ...formvalues, shipper: event.target.value });
            }}
            minLength={42}
            maxLength={42}
            required
          />
          <label htmlFor="receiver">
            <b>Receiver's Ethereum Address</b>
          </label>
          <input
            type="text"
            placeholder="Enter Receiver's Ethereum Address"
            name="receiver"
            value={formvalues.shipper}
            onChange={(event) => {
              setformvalues({ ...formvalues, receiver: event.target.value });
            }}
            minLength={42}
            maxLength={42}
            required
          />
          <label htmlFor="expiry">
            <b>Expiry Date</b>
          </label>
          <input
            type="datetime-local"
            name="expiry"
            value={formvalues.name}
            onChange={(event) => {
              setformvalues({ ...formvalues, expiry: event.target.value });
            }}
            required
          />
          <div className="clearfix">
            <button type="submit" className="btn">
              Register
            </button>
          </div>
        </div>
      </form>
      <div className="space"></div>
    </div>
  );
}