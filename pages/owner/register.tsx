import React from "react";
import supplychain from "../../ethereum/supplychain";
import NavBar from "../../components/NavBar";
import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import web3 from "../../ethereum/web3";
import Map, {
    GeolocateControl,
    Marker,
    NavigationControl,
    Popup,
} from "react-map-gl";

export default function register() {
    const [address, setAddress] = useState("");
    const [formvalues, setformvalues] = useState({
        name: "",
        address: "",
        margin: "",
        role: "1",
    });
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [viewState, setViewState] = useState({
        longitude: 76.78532,
        latitude: 30.76728,
        zoom: 14,
    });
    const [locstr, setLocstr] = useState();
    const [showPopup, setShowPopup] = useState(true);
    const [step, setStep] = useState(1);
    const [registering, setRegistering] = useState(false);
    const mapboxToken =
        "pk.eyJ1IjoicGl5dXNoMjUiLCJhIjoiY2wwbTE3bzh0MTBtYjNqbnNvMHZ0emI4YSJ9.CtZycFXd4GxSNTU1zG0mnA";
    const links = [
        { name: "Users", address: "/owner", active: false },
        { name: "Register", address: "#", active: true },
    ];
    const geolocateControlRef = useRef();
    useEffect(async () => {
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
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
        if(formvalues.margin==""){
            setformvalues({...formvalues,margin:"0"});
        }
        console.log(formvalues);
        setRegistering(true);
        console.log("Registering...");
        let loc = location.longitude + "," + location.latitude;
        console.log(loc);
        await supplychain.methods
            .registerUser(
                formvalues.address,
                formvalues.name,
                loc,
                formvalues.margin,
                formvalues.role
            )
            .send({
                from: address,
            });
        setRegistering(false);
        setStep(1);
        setformvalues({ ...formvalues, name: "", address: "", margin: "", role: "1" });
        console.log("Finished!!!");
    };
    const getLocstr = async (longitude, latitude) => {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
        );
        const addstr = await res.json();
        setLocstr(
            addstr.features.length != 0
                ? addstr.features[0].place_name
                : "Unknown Place"
        );
        setShowPopup(true);
        console.log(addstr);
    };
    return (
        <div className="register">
            <Head>
                <title>Register User</title>
            </Head>
            <NavBar links={links}></NavBar>

            {step == 1 ? (
                <div className="container">
                    <p>Step {step} of 2</p>
                    <h2>Register</h2>
                    <p>Please fill in this form to create an account.</p>
                    <form
                        className="register-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setStep(2);
                        }}
                    >
                        <label htmlFor="name">
                            <b>Name</b>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formvalues.name}
                            onChange={(event) => {
                                setformvalues({
                                    ...formvalues,
                                    name: event.target.value,
                                });
                            }}
                            placeholder="Enter User's Name"
                            required
                        />
                        <label htmlFor="address">
                            <b>Ethereum Address</b>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter User's Ethereum address"
                            name="address"
                            value={formvalues.address}
                            onChange={(event) => {
                                setformvalues({
                                    ...formvalues,
                                    address: event.target.value,
                                });
                            }}
                            minLength={42}
                            maxLength={42}
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
                                    setformvalues({
                                        ...formvalues,
                                        role: event.target.value,
                                    });
                                }}
                            >
                                <option value={1}>Manufacturer</option>
                                <option value={2}>Wholesaler</option>
                                <option value={3}>Distributer</option>
                                <option value={4}>Pharma</option>
                                <option value={5}>Transporter</option>
                            </select>
                        </div>

                        {formvalues.role=="2" || formvalues.role=="3"?<div><label htmlFor="margin">
                            <b>Margin</b>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter User's Margin (in %)"
                            name="margin"
                            value={formvalues.margin}
                            onChange={(event) => {
                                setformvalues({
                                    ...formvalues,
                                    margin: event.target.value,
                                });
                            }}
                            required
                        /></div>:null}
                        <div className="clearfix">
                            <button type="submit" className="btn">
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="p-5 border rounded-lg bg-white border-gray-500 shadow-lg w-fit top-36 relative">
                        <p>Step {step} of 2</p>
                        <h2>Select Location</h2>
                        <p>Please select your workplace location.</p>
                        <Map
                            {...viewState}
                            onMove={(evt) => setViewState(evt.viewState)}
                            style={{ height: 550, width: 590 }}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            mapboxAccessToken={mapboxToken}
                            onClick={(e) => {
                                console.log(e.lngLat);
                                setLocation({
                                    latitude: e.lngLat.lat,
                                    longitude: e.lngLat.lng,
                                });
                                getLocstr(e.lngLat.lng, e.lngLat.lat);
                            }}
                            onLoad={(e) => {
                                console.log(geolocateControlRef);
                                geolocateControlRef.current.trigger();
                            }}
                        >
                            {location.latitude ? (
                                <Marker
                                    latitude={location.latitude}
                                    longitude={location.longitude}
                                    draggable={true}
                                    onDragEnd={(e) => {
                                        console.log(e.lngLat);
                                        setLocation({
                                            latitude: e.lngLat.lat,
                                            longitude: e.lngLat.lng,
                                        });
                                        getLocstr(e.lngLat.lng, e.lngLat.lat);
                                    }}
                                ></Marker>
                            ) : null}
                            {locstr && showPopup ? (
                                <Popup
                                    longitude={location.longitude}
                                    latitude={location.latitude}
                                    focusAfterOpen={false}
                                    onClose={() => {
                                        setShowPopup(false);
                                    }}
                                    offset={30}
                                    anchor="bottom"
                                >
                                    {locstr}
                                </Popup>
                            ) : null}

                            <GeolocateControl
                                ref={geolocateControlRef}
                                onGeolocate={(e) => {
                                    console.log(e.coords);
                                    setLocation({
                                        latitude: e.coords.latitude,
                                        longitude: e.coords.longitude,
                                    });
                                    getLocstr(
                                        e.coords.longitude,
                                        e.coords.latitude
                                    );
                                }}
                                showAccuracyCircle={false}
                            />
                            <NavigationControl />
                        </Map>
                        <div className="flex">
                            <button
                                className="bg-white text-red-500 p-2 rounded m-2 border border-gray-600 grow"
                                onClick={() => {
                                    setStep(1);
                                }}
                            >
                                Previous
                            </button>
                            {registering ? (
                                <button className="bg-red-500 text-white p-2 rounded m-2 grow">
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Registering...
                                </button>
                            ) : (
                                <button
                                    className="bg-red-500 text-white p-2 rounded m-2 grow"
                                    onClick={registerUser}
                                >
                                    Register
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="space"></div>
        </div>
    );
}