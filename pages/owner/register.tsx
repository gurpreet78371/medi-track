import React from "react";
import supplychain from "../../ethereum/supplychain";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import web3 from "../../ethereum/web3";

export default function register() {
  const [address, setAddress] = useState("");
  const [formvalues, setformvalues] = useState({
    name: "",
    address: "",
    role: "",
    location: "",
  });
  const links = [
    { name: "Register", address: "#", active: true },
    { name: "User", address: "/owner", active: false },
  ];
  useEffect(async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    const owner = await supplychain.methods.owner().call();
    if (account != owner) {
      alert("You are not a owner");
    } else {
      // alert("You are owner");
      setAddress(account);
    }
  }, []);
  const registerUser = async (event) => {
    event.preventDefault();
    console.log(formvalues);
    await supplychain.methods
      .registerUser(
        formvalues.address,
        formvalues.name,
        formvalues.location,
        formvalues.role
      )
      .send({
        from: address,
      });
  };
  const getUsers = async () => {
    const users = await supplychain.methods.getUsers().call();
    console.log(users);
    getUserInfo(users[0]);
  };
  const getUserInfo = async (address) => {
    const user = await supplychain.methods.getUserInfo(address).call();
    console.log(user);
  };
  return (
    <div className="register">
      <NavBar links={links}></NavBar>
      <form className="register-form" onSubmit={registerUser}>
        <div className="container">
          <h2>Register</h2>
          <p>Please fill in this form to create an account.</p>
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
            placeholder="Enter User's Name"
            required
          />
          <label htmlFor="address">
            <b>Etherium Address</b>
          </label>
          <input
            type="text"
            placeholder="Enter User's Ethereum address"
            name="address"
            value={formvalues.address}
            onChange={(event) => {
              setformvalues({ ...formvalues, address: event.target.value });
            }}
            minLength={42}
            maxLength={42}
            required
          />
          <label htmlFor="location">
            <b>Location</b>
          </label>
          <input
            type="text"
            placeholder="Enter User's Location"
            name="location"
            value={formvalues.location}
            onChange={(event) => {
              setformvalues({ ...formvalues, location: event.target.value });
            }}
            data-toggle="modal"
            data-target="#exampleModalLong"
            required
          />
          <label htmlFor="role">
            <b> Role</b>
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
              <option value={1}>Manufacturer</option>
              <option value={2}>Wholesaler</option>
              <option value={3}>Distributer</option>
              <option value={4}>Pharma</option>
              <option value={5}>Transporter</option>
            </select>
          </div>
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
