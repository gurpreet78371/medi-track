import React from "react";
import supplychain from "../../ethereum/supplychain";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import web3 from "../../ethereum/web3";
import medicine from "../../ethereum/medicine";

export default function receive() {
  const [address, setAddress] = useState("");
  const [loading,setLoading]=useState(false);
  const [formvalues, setformvalues] = useState({
    batch: "",
    role: 0,
  });
  const links = [
    { name: "Batches", address: "/transporter", active: false },
    { name: "Create", address: "#", active: true },
  ];

  useEffect(async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    const info = await supplychain.methods.getUserInfo(account).call();
    if (info.role != 5) {
      console.log("You are not transporter!!!");
    } else {
      console.log("You are transporter!!!");
      setAddress(account);
    }
  }, []);
  const pickPackage = async (event) => {
    event.preventDefault();
    console.log(formvalues);
    setLoading(true);
    await medicine(formvalues.batch).methods
        .pickPackage(
            address,
            parseInt(formvalues.role)
        )
        .send({
            from: address,
        });
    setLoading(false);
  };
  return (
    <div className="register">
      <NavBar links={links}></NavBar>
      <form className="register-form" onSubmit={pickPackage}>
        <div className="container">
          <h2>Pick Batch</h2>
          <p>Please fill in this form to pick a batch.</p>
          <label htmlFor="shipper">
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
          <label htmlFor="role">
            <b>Sender</b>
          </label>
          <br />
          <div className="btn-group dropright">
            <select
              name="role"
              className="dropdown-menu"
              style={{ position: "relative" }}
              value={formvalues.role}
              onChange={(event) => {
                setformvalues({ ...formvalues, role: event.target.value });
              }}
            >
              <option value={0}>Manufacturer</option>
              <option value={1}>Wholesaler</option>
              <option value={2}>Distributer</option>
              <option value={3}>Pharma</option>
            </select>
          </div>
          <div className="clearfix">
            
              {loading==true?<button type="submit" className="btn"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Processing...</button>:<button type="submit" className="btn">Pick</button>}
          </div>
        </div>
      </form>
      <div className="space"></div>
    </div>
  );
}
