import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect, useRef } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";
import Map, {
    GeolocateControl,
    Marker,
    NavigationControl,
    Popup,
} from "react-map-gl";

const links = [
    { name: "Users", address: "#", active: true },
    { name: "Register", address: "/owner/register", active: false },
];

export default function userList({ usersInfo }) {
    const [userData, setUserData] = useState(usersInfo);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewState, setViewState] = useState({
        longitude: 76.78532,
        latitude: 30.76728,
        zoom: 4,
    });
    const [mode, setMode] = useState(0);
    const mapboxToken =
        "pk.eyJ1IjoicGl5dXNoMjUiLCJhIjoiY2wwbTE3bzh0MTBtYjNqbnNvMHZ0emI4YSJ9.CtZycFXd4GxSNTU1zG0mnA";

    const getData = (e) => {
        console.log(e.target.value);
        setSelectedUser(null);
        if (e.target.value == "All") {
            setUserData(usersInfo);
        } else {
            let data = [];
            for (let user in usersInfo) {
                if (usersInfo[user].role == e.target.value) {
                    data.push(usersInfo[user]);
                }
            }
            setUserData(data);
        }
    };
    return (
        <div className="body">
            <NavBar links={links} />
            <div className="content">
                <div className="container" style={{ maxWidth: "80%" }}>
                    <div className="table-responsive custom-table-responsive">
                        <div className="filter-box">
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
                                            <th scope="col">Role</th>
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
                                                        key={userobj.ethAddress}
                                                    >
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <Link href={`/wholesaler/${userobj.ethAddress}`}>
                                                                {userobj.name}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            {userobj.ethAddress}
                                                        </td>
                                                        <td>
                                                            {userobj.address}
                                                        </td>
                                                        <td>{userobj.role}</td>
                                                    </tr>
                                                </>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {userData.length == 0 ? (
                                    <p>No User Available</p>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        ) : (
                            <div className="my-4">
                            <Map
                                {...viewState}
                                onMove={(evt) => setViewState(evt.viewState)}
                                style={{height: 550, width: 1190}}
                                mapStyle="mapbox://styles/mapbox/streets-v11"
                                mapboxAccessToken={mapboxToken}
                            >
                                {userData.map((userobj) => {
                                    const coordinates =
                                        userobj.location.split(",");
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
                                        longitude={
                                            selectedUser.location.split(",")[0]
                                        }
                                        latitude={
                                            selectedUser.location.split(",")[1]
                                        }
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
                                            <button className="bg-red-500 text-white p-2 rounded"><Link href={`/wholesaler/${selectedUser.ethAddress}`}>Order</Link></button>
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

export async function getStaticProps() {
    const users = await supplychain.methods.getUsers().call();
    let usersInfo = [];
    for (let user in users) {
        const userInfo = await supplychain.methods
            .getUserInfo(users[parseInt(user)])
            .call();
        let rolestr;
        let icon;
        if (userInfo[4] == 1) {
            rolestr = "Manufacturer";
            icon = "factory-icon";
        } 
        else{
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
    return {
        props: {
            usersInfo,
        },
    };
}
