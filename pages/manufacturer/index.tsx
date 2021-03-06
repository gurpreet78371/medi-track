import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Medicine from "../../ethereum/medicine";
import web3 from "../../ethereum/web3";
import Link from "next/link";
import Head from "next/head";

const links = [
    { name: "Dashboard", address: "/manufacturer/dashboard", active: false },
    { name: "Inventory", address: "#", active: true },
    { name: "Orders", address: "/manufacturer/orders", active: false },
    { name: "Add Batch", address: "/manufacturer/create", active: false },
    { name: "Profile", address: "/manufacturer/profile", active: false },
];

export default function batchList() {
    const [address, setAddress] = useState("0x0");
    const [medicines, setMedicines] = useState([]);
    const [medicinesDisplay, setMedicinesDisplay] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        setLoading(true);
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        const account = web3.utils.toChecksumAddress(accounts[0]);
        const info = await supplychain.methods.getUserInfo(account).call();
        console.log(info);
        console.log(account);
        if (info[4] != 1) {
            console.log("You are not a manufacturer");
        } else {
            console.log("You are manufacturer");
            setAddress(account);
            const meds = await supplychain.methods
                .getMedicinesMan(account)
                .call();
            console.log(meds);
            let medsInfo = [];
            for (let med in meds) {
                const medicine = Medicine(meds[med]);
                const info = await medicine.methods.getInfo().call();
                console.log(info);
                medsInfo.push({ ...info, address: meds[med] });
            }
            console.log(medsInfo);
            setMedicines(medsInfo);
            setMedicinesDisplay(medsInfo);
        }
        setLoading(false);
    }, []);

    const filterMedicines = (e) => {
        console.log(e.target.value);
        if (e.target.value == "All") {
            setMedicinesDisplay(medicines);
        } else {
            let meds = [];
            for (let med in medicines) {
                console.log(med);
                console.log(medicines[med]);
                if (e.target.value == "Shipped" && medicines[med][2] != 0) {
                    meds.push(medicines[med]);
                } else if (
                    e.target.value == "NotShipped" &&
                    medicines[med][2] == 0
                ) {
                    meds.push(medicines[med]);
                }
            }
            setMedicinesDisplay(meds);
        }
    };
    return (
        <div className="body">
            <Head>
                <title>Inventory</title>
            </Head>
            <NavBar links={links} />
            <div className="content">
                <div className="container" style={{ maxWidth: "80%" }}>
                    <div className="table-responsive custom-table-responsive">
                        <div className="filter-box">
                            <div className="filter">
                                <label
                                    htmlFor="filter"
                                    className="filter-label"
                                >
                                    Filter:
                                </label>
                                <select
                                    name="filter"
                                    id="filter"
                                    onChange={filterMedicines}
                                >
                                    <option value="All">All Medicines</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="NotShipped">
                                        Not Shipped
                                    </option>
                                </select>
                            </div>
                        </div>
                        <table className="table custom-table">
                            <thead>
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Price (in Eth)</th>
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
                                                    <Link
                                                        href={`/${med.address}`}
                                                    >
                                                        <a>{med[0]}</a>
                                                    </Link>
                                                </td>
                                                <td>{med[1]}</td>
                                                <td>{med[6]/1000000000000}</td>
                                                {med[2] == "0" ? (
                                                    <td className="text-red-500">Not Shipped</td>
                                                ) : (
                                                    <td className="text-green-500">Shipped</td>
                                                )}
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                        {loading == true ? (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p></p>
                        )}
                        {medicinesDisplay.length == 0 && loading == false ? (
                            <p>No Medicine Available</p>
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
