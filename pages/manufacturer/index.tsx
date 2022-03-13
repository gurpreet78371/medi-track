import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Medicine from "../../ethereum/medicine";
import web3 from "../../ethereum/web3";

const links = [
  { name: "Batches", address: "#", active: true },
  { name: "Create", address: "/manufacturer/create", active: false },
];

export default function batchList() {
  const [address, setAddress] = useState("0x0");
  const [medicines, setMedicines] = useState([]);
  const [medicinesDisplay, setMedicinesDisplay] = useState([]);

  useEffect(async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    const info = await supplychain.methods.getUserInfo(account).call();
    console.log(info);
    console.log(account);
    if (info.role != 1) {
      console.log("You are not a manufacturer");
    } else {
      console.log("You are manufacturer");
      setAddress(account);
      const meds = await supplychain.methods.getMedicinesMan(account).call();
      console.log(meds);
      let medsInfo = [];
      for (let med in meds) {
        const medicine = Medicine(meds[med]);
        const info = await medicine.methods.getInfo().call();
        console.log(info);
        medsInfo.push({ ...info, address: meds[med] });
      }
      setMedicines(medsInfo);
      setMedicinesDisplay(medsInfo);
    }
  }, []);

  const filterMedicines = (e) => {
    console.log(e.target.value);
    if (e.target.value == "All") {
      setMedicinesDisplay(medicines);
    } else {
      let meds = [];
      for (let med in medicines) {
        if (e.target.value == "Shipped" && medicines[med].status != 0) {
          meds.push(medicines[med]);
        } else if (
          e.target.value == "NotShipped" &&
          medicines[med].status == 0
        ) {
          meds.push(medicines[med]);
        }
      }
      setMedicinesDisplay(meds);
    }
  };
  return (
    <div className="body">
      <NavBar links={links} />
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          <div className="table-responsive custom-table-responsive">
            <div className="filter-box">
              <div className="filter">
                <label htmlFor="filter" className="filter-label">
                  Filter:
                </label>
                <select name="filter" id="filter" onChange={filterMedicines}>
                  <option value="All">All Medicines</option>
                  <option value="Shipped">Shipped</option>
                  <option value="NotShipped">Not Shipped</option>
                </select>
              </div>
            </div>
            <table className="table custom-table">
              <thead>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Condition</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {medicinesDisplay.map((med, index) => {
                  return (
                    <>
                      <tr className="spacer">
                        <td colSpan={100}></td>
                      </tr>
                      <tr key={med.address}>
                        <td>{index + 1}</td>
                        <td>
                          <a href="#">{med.name}</a>
                        </td>
                        <td>{med.quantity}</td>
                        {med.condition == 0 ? <td>Fresh</td> : <td>Damaged</td>}
                        {med.status == 0 ? (
                          <td>Not Shipped</td>
                        ) : (
                          <td>Shipped</td>
                        )}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
            {/* {userData.length == 0 ? <p>No User Available</p> : <p></p>} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const users = await supplychain.methods.getUsers().call();
  let usersInfo = [];
  for (let user in users) {
    const userInfo = await supplychain.methods
      .getUserInfo(users[parseInt(user)])
      .call();
    let rolestr;
    if (userInfo.role == 1) {
      rolestr = "Manufacturer";
    } else if (userInfo.role == 2) {
      rolestr = "Wholesaler";
    } else if (userInfo.role == 3) {
      rolestr = "Distributer";
    } else if (userInfo.role == 4) {
      rolestr = "Pharma";
    } else if (userInfo.role == 5) {
      rolestr = "Transporter";
    }
    let userobj = {
      name: userInfo.name,
      location: userInfo.location,
      ethAddress: userInfo.ethAddress,
      role: rolestr,
    };
    usersInfo.push(userobj);
  }
  return {
    props: {
      usersInfo,
    },
  };
}
