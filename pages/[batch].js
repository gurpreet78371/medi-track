import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import { useRouter } from "next/router";
import { useState } from "react";
import Medicine from "../ethereum/medicine";
import supplychain from "../ethereum/supplychain";
import Map, {
    GeolocateControl,
    Marker,
    NavigationControl,
    Popup,
} from "react-map-gl";

export default function medicine_info() {
    const [medInfo, setMedInfo] = useState({});
    const [ownersInfo, setOwnersInfo] = useState([]);
    const [currentOwner, setCurrentOwner] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewState, setViewState] = useState({
        longitude: 76.78532,
        latitude: 30.76728,
        zoom: 12,
    });
    const router = useRouter();
    const batch = router.query.batch;
    const mapboxToken =
        "pk.eyJ1IjoicGl5dXNoMjUiLCJhIjoiY2wwbTE3bzh0MTBtYjNqbnNvMHZ0emI4YSJ9.CtZycFXd4GxSNTU1zG0mnA";
    useEffect(async () => {
        console.log(router.query);
        console.log(batch);
        const medicine = Medicine(batch);
        const info = await medicine.methods.getInfo().call();
        if (info[2] == 0) {
            info[2] = "At Manufacturer";
            setCurrentOwner(0);
        } else if (info[2] == 1) {
            info[2] = "At Wholesaler";
            setCurrentOwner(1);
        } else if (info[2] == 2) {
            info[2] = "At Distributer";
            setCurrentOwner(2);
        } else if (info[2] == 3) {
            info[2] = "At Pharma";
            setCurrentOwner(3);
        } else if (info[2] == 4) {
            info[2] = "Picked for Manufacturer";
        } else if (info[2] == 5) {
            info[2] = "Picked for Wholesaler";
        } else if (info[2] == 6) {
            info[2] = "Picked for Distributer";
        } else if (info[2] == 7) {
            info[2] = "Picked for Pharma";
        }
        // const expiry=await medicine.methods.expiry().call();
        // setMedInfo({...info,expiry:expiry});
        setMedInfo(info);
        console.log(info);
        let owners = [];
        for (let owner in info[3]) {
            if (
                info[3][owner] != "0x0000000000000000000000000000000000000000"
            ) {
                let ownerInfo = await supplychain.methods
                    .getUserInfo(info[3][owner])
                    .call();
                let icon;
                if (ownerInfo[4] == 1) {
                    ownerInfo[4] = "Manufacturer";
                    icon = "factory-icon";
                } else if (ownerInfo[4] == 2) {
                    ownerInfo[4] = "Wholesaler";
                    icon = "wholesale-icon";
                } else if (ownerInfo[4] == 3) {
                    ownerInfo[4] = "Distributer";
                    icon = "transport-icon3";
                } else if (ownerInfo[4] == 4) {
                    ownerInfo[4] = "Pharma";
                    icon = "pharma-icon2";
                }
                else if (ownerInfo[4] == 5) {
                    ownerInfo[4] = "Transporter";
                    icon = "transport-icon1";
                }
                const res = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${
                        ownerInfo[1].split(",")[0]
                    },${
                        ownerInfo[1].split(",")[1]
                    }.json?access_token=${mapboxToken}`
                );
                const address = await res.json();
                ownerInfo.address =
                    address.features.length != 0
                        ? address.features[0].place_name
                        : "Unknown Place";
                ownerInfo.icon=icon;
                owners.push(ownerInfo);
            }
        }
        console.log(owners);
        setOwnersInfo(owners);
    }, []);
    const links = [];
    return (
        <div className="body">
            <div className="nav-box">
                <NavBar links={links} />
            </div>

            <div className="medicine">
                <div className="medicine-info">
                    <div className="left-half">
                        <h3 className="name">{medInfo[0]}</h3>
                        <div className="row1">
                            <div className="left">Name: </div>
                            <div className="right">{medInfo[0]}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Quantity: </div>
                            <div className="right">{medInfo[1]}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Status:</div>
                            <div className="right">{medInfo[2]}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Price (in ETH):</div>
                            <div className="right">{medInfo[6]/1000000000000}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Expiry</div>
                            <div className="right">{medInfo[4]}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Current Owner</div>
                            {ownersInfo.length != 0 ? (
                                <div className="right">
                                    {ownersInfo[currentOwner][0]}
                                </div>
                            ) : (
                                <div className="right"></div>
                            )}
                        </div>
                    </div>
                    <div className="right-half">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?data=${batch}&amp;size=100x100`}
                            alt="QR code"
                            title=""
                        />
                        {/* <img src="/qr.jpg" alt="QR code" /> */}
                    </div>
                </div>

                <div className="divider"></div>

                <div className="history">
                    <div className="left">
                        <section className="experience" id="experience">
                            <div className="max-width1">
                                <div className="experience-content">
                                    {ownersInfo.map((owner) => {
                                        return (
                                            <div
                                                className="outer"
                                                key={owner[2]}
                                            >
                                                <div className="card">
                                                    <div className="experience-details">
                                                        <div className="experience-level">
                                                            {owner[0]}
                                                        </div>
                                                        <div className="date italic">
                                                            {owner[4]}
                                                        </div>
                                                        <div className="company">
                                                            {owner.address}
                                                        </div>
                                                    </div>
                                                    <div className="square" />
                                                </div>
                                                <div className="circle">
                                                    <i className="fas fa-envelope" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="right">
                        <Map
                            {...viewState}
                            onMove={(evt) => setViewState(evt.viewState)}
                            style={{ height: 550, width: 590 }}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            mapboxAccessToken={mapboxToken}
                        >
                            {ownersInfo.map((userobj) => {
                                const coordinates = userobj[1].split(",");
                                return (
                                    <Marker
                                        key={userobj[2]}
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
                                        selectedUser[1].split(",")[0]
                                    }
                                    latitude={
                                        selectedUser[1].split(",")[1]
                                    }
                                    closeOnClick={false}
                                    onClose={() => {
                                        setSelectedUser(null);
                                    }}
                                    focusAfterOpen={false}
                                >
                                    <div>
                                        <h2>{selectedUser[0]}</h2>
                                        <h6>{selectedUser[4]}</h6>
                                        <p>{selectedUser.address}</p>
                                    </div>
                                </Popup>
                            ) : null}
                            <GeolocateControl />
                            <NavigationControl />
                        </Map>
                    </div>
                </div>
            </div>
        </div>
    );
}
