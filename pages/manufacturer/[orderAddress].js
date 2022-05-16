import React from "react";
import supplychain from "../../ethereum/supplychain";
import Order from "../../ethereum/order";
import web3 from "../../ethereum/web3";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import Link from "next/link";
import Head from "next/head";
import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
} from "react-map-gl";

const links = [
  { name: "Dashboard", address: "/manufacturer/dashboard", active: false },
  { name: "Inventory", address: "/manufacturer", active: false },
  { name: "Orders", address: "/manufacturer/orders", active: true },
  { name: "Add Batch", address: "/manufacturer/create", active: false },
  { name: "Profile", address: "/manufacturer/profile", active: false },
];

export default function userList() {
  const [userAddress, setUserAddress] = useState();
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();
  const orderAddress = router.query.orderAddress;
  const [viewState, setViewState] = useState({
    longitude: 76.78532,
    latitude: 30.76728,
    zoom: 4,
  });
  const [mode, setMode] = useState(0);
  const mapboxToken =
    "pk.eyJ1IjoicGl5dXNoMjUiLCJhIjoiY2wwbTE3bzh0MTBtYjNqbnNvMHZ0emI4YSJ9.CtZycFXd4GxSNTU1zG0mnA";

  useEffect(async () => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    setUserAddress(account);
    const users = await supplychain.methods.getUsers().call();
    let usersInfo = [];
    for (let user in users) {
      const userInfo = await supplychain.methods
        .getUserInfo(users[parseInt(user)])
        .call();
      let rolestr;
      let icon;
      if (userInfo[4] == 5) {
        rolestr = "Transporter";
        icon = "transport-icon1";
      } else {
        continue;
      }
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          userInfo[1].split(",")[0]
        },${
          userInfo[1].split(",")[1]
        }.json?access_token=pk.eyJ1IjoicGl5dXNoMjUiLCJhIjoiY2wwbTE3bzh0MTBtYjNqbnNvMHZ0emI4YSJ9.CtZycFXd4GxSNTU1zG0mnA`
      );
      const address = await res.json();
      userInfo.address =
        address.features.length != 0
          ? address.features[0].place_name
          : "Nameless Place";
      let userobj = {
        name: userInfo[0],
        location: userInfo[1],
        address: userInfo.address,
        ethAddress: userInfo[2],
        role: rolestr,
        icon: icon,
      };
      usersInfo.push(userobj);
    }
    setUserData(usersInfo);
  });

  const addInfo = async () => {
    await Order(orderAddress)
      .methods.addInfo(selectedUser, 0)
      .send({ from: userAddress });
  };

  return (
    <div className="body">
      <NavBar links={links} />
      <Head>
        <title>Select Shipper</title>
      </Head>
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          <div className="table-responsive custom-table-responsive">
            <div className="filter-box flex justify-between">
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  setMode((mode + 1) % 2);
                }}
              >
                {mode == 0 ? (
                  <div>Switch to Map View</div>
                ) : (
                  <div>Switch to Table View</div>
                )}
              </button>
              {selectedUser != null ? (
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={addInfo}
                >
                  Select Shipper
                </button>
              ) : (
                <button
                  className="bg-red-500 text-white p-2 rounded cursor-not-allowed"
                  disabled
                >
                  Select Shipper
                </button>
              )}
            </div>
            {mode == 0 ? (
              <div className="mt-3">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">Location</th>
                      <th scope="col">Selected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((userobj, index) => {
                      return (
                        <>
                          <tr className="spacer">
                            <td colSpan={100}></td>
                          </tr>
                          <tr
                            onClick={() => {
                              if (selectedUser == userobj.ethAddress) {
                                setSelectedUser(null);
                              } else {
                                setSelectedUser(userobj.ethAddress);
                              }
                            }}
                            key={userobj.ethAddress}
                          >
                            <td>{index + 1}</td>
                            <td>
                              <Link href={`/wholesaler/${userobj.ethAddress}`}>
                                {userobj.name}
                              </Link>
                            </td>
                            <td>{userobj.ethAddress}</td>
                            <td>{userobj.address}</td>
                            <td>
                              {selectedUser == userobj.ethAddress ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-check-circle-fill text-green-500"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                              ) : (
                                <div>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-circle"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                  </svg>
                                </div>
                              )}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                {userData.length == 0 ? <p>No User Available</p> : <p></p>}
              </div>
            ) : (
              <div className="my-4">
                <Map
                  {...viewState}
                  onMove={(evt) => setViewState(evt.viewState)}
                  style={{ height: 550, width: 1190 }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={mapboxToken}
                >
                  {userData.map((userobj) => {
                    const coordinates = userobj.location.split(",");
                    return (
                      <Marker
                        key={userobj.ethAddress}
                        longitude={coordinates[0]}
                        latitude={coordinates[1]}
                      >
                        <img
                          src={`/${userobj.icon}.png`}
                          style={{
                            height: 30,
                            width: 30,
                          }}
                          onClick={async (e) => {
                            e.preventDefault();
                            setSelectedUser(userobj);
                          }}
                        ></img>
                      </Marker>
                    );
                  })}
                  {selectedUser ? (
                    <Popup
                      longitude={selectedUser.location.split(",")[0]}
                      latitude={selectedUser.location.split(",")[1]}
                      closeOnClick={false}
                      onClose={() => {
                        setSelectedUser(null);
                      }}
                      focusAfterOpen={false}
                    >
                      <div>
                        <h2>{selectedUser.name}</h2>
                        <h6>{selectedUser.role}</h6>
                        <p>{selectedUser.address}</p>
                        <button className="bg-red-500 text-white p-2 rounded">
                          <Link href={`/wholesaler/${selectedUser.ethAddress}`}>
                            Order
                          </Link>
                        </button>
                      </div>
                    </Popup>
                  ) : null}
                  <GeolocateControl />
                  <NavigationControl />
                </Map>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
