import React from "react";
import supplychain from "../../ethereum/supplychain";
import NavBar from "../../components/NavBar";

export default function register() {
  return (
    <div className="register">
      <NavBar></NavBar>
      <form className="register-form">
        <div className="container">
          <h2>Register</h2>
          <p>Please fill in this form to create an account.</p>
          <label htmlFor="email">
            <b>Username</b>
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            required
          />
          <label htmlFor="etherium addrerss">
            <b>Etherium Address</b>
          </label>
          <input
            type="text"
            placeholder="Enter address"
            name="email"
            minLength={42}
            maxLength={42}
            required
          />
          <label htmlFor="psw">
            <b>Location</b>
          </label>
          <input
            type="text"
            placeholder="Enter Location"
            name="psw"
            data-toggle="modal"
            data-target="#exampleModalLong"
            required
          />
          <label htmlFor="email">
            <b> Role</b>
          </label>
          <br />
          <div className="btn-group dropright">
            <button
              type="button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Dropright
            </button>
            <div className="dropdown-menu">
              <option value={66}>Manufacturer</option>
              <option value={66}>Wholesaler</option>
              <option value={66}>Supplier</option>
              <option value={66}>Pharmacist</option>
            </div>
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
