import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Medicine from "../../ethereum/medicine";
import web3 from "../../ethereum/web3";

const links = [
  { name: "Register", address: "/owner/register", active: false },
  { name: "User", address: "#", active: true },
];

export default function batchList() {
    const [address,setAddress]=useState('0x0');
    const [medicines,setMedicines]=useState([]);

    useEffect(async ()=>{
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = web3.utils.toChecksumAddress(accounts[0]);
        const info=await supplychain.methods.getUserInfo(account).call();
        console.log(info);
        console.log(account);
        if(info.role!=1){
            console.log("You are not a manufacturer");
        }
        else{
            console.log("You are manufacturer");
            setAddress(account);
            const meds=await supplychain.methods.getMedicinesMan(account).call();
            let medInfo=[];
            for (let med in meds){
                console.log(med);
            }
            setMedicines(meds);
        }
    },[])

    async function getMedicines(){
        const med=await supplychain.methods.getMedicinesMan(address).call();
        console.log(med);
    }

    async function getMedicineInfo(batchAddress){
        const medicine= Medicine(batchAddress);
        const info=await medicine.methods.getInfo().call();
        console.log(info);
    }
  return (
    <div className="body">
      <NavBar links={links}/>
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          <div className="table-responsive custom-table-responsive">
            <div className="filter-box">
              <div className="filter">
                <label htmlFor="filter" className="filter-label">
                  Filter:
                </label>
                <select name="filter" id="filter" onChange={getMedicines}>
                  <option value="All">All Users</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributer">Distributer</option>
                  <option value="Pharma">Pharma</option>
                  <option value="Transporter">Transporter</option>
                </select>
              </div>
            </div>
            <table className="table custom-table">
              <thead>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Location</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                {/* {userData.map((userobj, index) => {
                  return (
                    <>
                      <tr className="spacer">
                        <td colSpan={100}></td>
                      </tr>
                      <tr key={userobj.ethAddress}>
                        <td>{index + 1}</td>
                        <td>
                          <a href="#">{userobj.name}</a>
                        </td>
                        <td>{userobj.ethAddress}</td>
                        <td>{userobj.location}</td>
                        <td>{userobj.role}</td>
                      </tr>
                    </>
                  );
                })} */}
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
