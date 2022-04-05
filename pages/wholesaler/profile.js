import React, { useEffect } from "react";
import NavBar from "../../components/NavBar";
import web3 from "../../ethereum/web3";
import { useState } from "react";
import supplychain from "../../ethereum/supplychain";
import Map, {
    GeolocateControl,
    Marker,
    NavigationControl,
    Popup,
} from "react-map-gl";

export default function userDetail() {
    const [userInfo, setUserInfo] = useState({
        name: "",
        location: "",
        address: "",
        ethAddress: "",
        role: "",
        icon: "",
    });
    const [viewState, setViewState] = useState({
        longitude: 76.78532,
        latitude: 30.76728,
        zoom: 12,
    });
    const [showPopup, setShowPopup] = useState(true);
    const [ethAddress, setEthAddress] = useState();
    const mapboxToken =
        "pk.eyJ1IjoicGl5dXNoMjUiLCJhIjoiY2wwbTE3bzh0MTBtYjNqbnNvMHZ0emI4YSJ9.CtZycFXd4GxSNTU1zG0mnA";
    useEffect(async () => {
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        const account = web3.utils.toChecksumAddress(accounts[0]);
        setEthAddress(account);
        let info = await supplychain.methods.getUserInfo(account).call();
        let icon;
        if (info.role == 1) {
            info.role = "Manufacturer";
            icon = "factory-icon";
        } else if (info.role == 2) {
            info.role = "Wholesaler";
            icon = "wholesale-icon";
        } else if (info.role == 1) {
            info.role = "Distributer";
            icon = "transport-icon3";
        } else if (info.role == 1) {
            info.role = "Pharma";
            icon = "pharma-icon2";
        }
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${
                info.location.split(",")[0]
            },${info.location.split(",")[1]}.json?access_token=${mapboxToken}`
        );
        const address = await res.json();
        info.address =
            address.features.length != 0
                ? address.features[0].place_name
                : "Unknown Place";
        info.icon = icon;
        setUserInfo(info);
        setViewState({
            ...viewState,
            longitude: info.location.split(",")[0],
            latitude: info.location.split(",")[1],
        });
    }, []);
    const links = [
        { name: "Batches", address: "/wholesaler", active: false },
        { name: "Receive", address: "/wholesaler/receive", active: false },
        { name: "Send", address: "/wholesaler/send", active: false},
        { name: "Profile", address: "#", active: true}
      ];
    return (
        <div className="body">
            <div className="nav-box">
                <NavBar links={links} />
            </div>

            <div className="medicine">
                <div className="medicine-info">
                    <div className="left-half">
                        <h3 className="name">{userInfo.name}</h3>
                        <div className="row1">
                            <div className="left">Name: </div>
                            <div className="right">{userInfo.name}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Role: </div>
                            <div className="right">{userInfo.role}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Address: </div>
                            <div className="right">{userInfo.address}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Ethereum Address: </div>
                            <div className="right">{userInfo.ethAddress}</div>
                        </div>
                        <div className="m-5"></div>
                        <div className="m-2"></div>
                    </div>
                    <div className="right-half">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?data=${ethAddress}&amp;size=100x100`}
                            alt="QR code"
                            title=""
                        />
                        {/* <img src="/qr.jpg" alt="QR code" /> */}
                    </div>
                </div>

                <div className="divider"></div>
                <h3 className="m-2">Location: </h3>
                <div className="m-2">
                    <Map
                        {...viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        style={{ height: 550, width: 1190 }}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        mapboxAccessToken={mapboxToken}
                    >
                        {userInfo.location.length != 0 ? (
                            <Marker
                                key={userInfo.ethAddress}
                                longitude={userInfo.location.split(",")[0]}
                                latitude={userInfo.location.split(",")[1]}
                            >
                                <img
                                    src={`/${userInfo.icon}.png`}
                                    style={{
                                        height: 30,
                                        width: 30,
                                    }}
                                    onClick={() => {
                                        setShowPopup(true);
                                    }}
                                ></img>
                            </Marker>
                        ) : null}

                        {userInfo.location.length != 0 && showPopup ? (
                            <Popup
                                longitude={userInfo.location.split(",")[0]}
                                latitude={userInfo.location.split(",")[1]}
                                closeOnClick={false}
                                onClose={(e) => {
                                    setShowPopup(false);
                                }}
                                focusAfterOpen={false}
                            >
                                <div>
                                    <h2>{userInfo.name}</h2>
                                    <h6>{userInfo.role}</h6>
                                    <p>{userInfo.address}</p>
                                </div>
                            </Popup>
                        ) : null}

                        <GeolocateControl />
                        <NavigationControl />
                    </Map>
                </div>
            </div>
        </div>
    );
}
