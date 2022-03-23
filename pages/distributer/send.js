import React from "react";
import supplychain from "../../ethereum/supplychain";
import medicine from "../../ethereum/medicine";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import web3 from "../../ethereum/web3";

export default function send() {
  const [address, setAddress] = useState("");
  const [loading,setLoading]=useState(false);
  const [formvalues, setformvalues] = useState({
    batch: "",
    shipper: "",
    receiver: "",
  });
  const links = [
    { name: "Batches", address: "/distributer", active: false },
    { name: "Receive", address: "/distributer/receive", active: false },
    { name: "Send", address: "#", active: true}
  ];

  useEffect(async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    const info = await supplychain.methods.getUserInfo(account).call();
    if (info.role != 3) {
      console.log("You are not distributer!!!");
    } else {
      console.log("You are distributer!!!");
      setAddress(account);
    }
  }, []);
  const sendPackage = async (event) => {
    event.preventDefault();
    console.log(formvalues);
    setLoading(true);
    await medicine(formvalues.batch).methods
        .sendPackage(
          address,
          formvalues.shipper,
          formvalues.receiver,
          2
        )
        .send({
            from: address,
        });
    setLoading(false);
  };
  return (
    <div className="register">
      <NavBar links={links}></NavBar>
      <form className="register-form" onSubmit={sendPackage}>
        <div className="container">
          <h2>Send Batch</h2>
          <p>Please fill in this form to send a batch.</p>
          <label htmlFor="batch">
            <b>Batch Address</b>
          </label>
          <input
            type="text"
            placeholder="Enter Batch Address"
            name="batch"
            value={formvalues.batch}
            onChange={(event) => {
              setformvalues({ ...formvalues, batch: event.target.value });
            }}
            minLength={42}
            maxLength={42}
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
            name="batch"
            value={formvalues.receiver}
            onChange={(event) => {
              setformvalues({ ...formvalues, receiver: event.target.value });
            }}
            minLength={42}
            maxLength={42}
            required
          />
          <div className="clearfix">
            
              {loading==true?<button type="submit" className="btn"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Processing...</button>:<button type="submit" className="btn">Receive</button>}
          </div>
        </div>
      </form>
      <div className="space"></div>
    </div>
  );
}
