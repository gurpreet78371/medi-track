import React from "react";
import supplychain from "../../ethereum/supplychain";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import web3 from "../../ethereum/web3";
import Head from "next/head";

export default function receive() {
  const [address, setAddress] = useState("");
  const [loading,setLoading]=useState(false);
  const [formvalues, setformvalues] = useState({
    batch: "",
    condition: 0,
  });
  const links = [
    { name: "Inventory", address: "/wholesaler/", active: false },
    { name: "Order", address: "/wholesaler/order", active: false },
    { name: "Orders", address: "/wholesaler/orders", active: false },
    { name: "Receive", address: "#", active: true },
    { name: "Profile", address: "/wholesaler/profile", active: false },
  ];

  useEffect(async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    const info = await supplychain.methods.getUserInfo(account).call();
    if (info.role != 2) {
      console.log("You are not wholesaler!!!");
    } else {
      console.log("You are wholesaler!!!");
      setAddress(account);
    }
  }, []);
  const receivePackage = async (event) => {
    event.preventDefault();
    console.log(formvalues);
    setLoading(true);
    await supplychain.methods
        .receiveMedicine(
            formvalues.batch,
            1,
            formvalues.condition
        )
        .send({
            from: address,
        });
    setLoading(false);
  };
  return (
    <div className="register">
      <NavBar links={links}></NavBar>
      <Head>
        <title>Receive Order</title>
      </Head>
      <form className="register-form" onSubmit={receivePackage}>
        <div className="container">
          <h2>Receive Order</h2>
          <p>Please fill in this form to receive an Order.</p>
          <label htmlFor="shipper">
            <b>Order Address</b>
          </label>
          <input
            type="text"
            placeholder="Enter Order Address"
            name="batch"
            value={formvalues.batch}
            onChange={(event) => {
              setformvalues({ ...formvalues, batch: event.target.value });
            }}
            minLength={42}
            maxLength={42}
            required
          />
          <label htmlFor="role">
            <b>Condition</b>
          </label>
          <br />
          <div className="btn-group dropright">
            <select
              name="role"
              className="dropdown-menu"
              style={{ position: "relative" }}
              value={formvalues.condition}
              onChange={(event) => {
                setformvalues({ ...formvalues, condition: event.target.value });
              }}
            >
              <option value={0}>Good</option>
              <option value={1}>Damaged</option>
            </select>
          </div>
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
