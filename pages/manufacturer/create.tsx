import React from "react";
import supplychain from "../../ethereum/supplychain";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import web3 from "../../ethereum/web3";
import Head from "next/head";

export default function register() {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [formvalues, setformvalues] = useState({
        name: "",
        quantity: "",
        price: "",
        expiry: String(new Date()),
    });
    const links = [
        { name: "Batches", address: "/manufacturer", active: false },
        { name: "Orders", address: "/manufacturer/orders", active: false },
        { name: "Add Batch", address: "#", active: true },
        { name: "Profile", address: "/manufacturer/profile", active: false },
    ];

    useEffect(async () => {
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        const account = web3.utils.toChecksumAddress(accounts[0]);
        const info = await supplychain.methods.getUserInfo(account).call();
        if (info[4] != 1) {
            console.log("You are not manufacturer!!!");
        } else {
            console.log("You are manufacturer!!!");
            setAddress(account);
        }
    }, []);
    const manufacture = async (event) => {
        event.preventDefault();
        console.log(formvalues);
        setLoading(true);
        let date=String(new Date());
        await supplychain.methods
            .manufactureMedicine(
                formvalues.name,
                parseInt(formvalues.quantity),
                formvalues.expiry,
                formvalues.price,
                date
            )
            .send({
                from: address,
            });
        setformvalues({
            ...formvalues,
            name: "",
            quantity: "",
            price: "",
            expiry: String(new Date()),
        });
        setLoading(false);
    };
    return (
        <div className="register">
            <Head>
                <title>Add new Batch</title>
            </Head>
            <NavBar links={links}></NavBar>
            <form className="register-form" onSubmit={manufacture}>
                <div className="container">
                    <h2>Add new Batch</h2>
                    <p>Please fill in this form to add a batch.</p>
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
                        placeholder="Enter Medicine Name"
                        required
                    />
                    <label htmlFor="quntity">
                        <b>Quantity</b>
                    </label>
                    <input
                        type="number"
                        placeholder="Enter quantity in this batch"
                        name="quantity"
                        value={formvalues.quantity}
                        onChange={(event) => {
                            setformvalues({
                                ...formvalues,
                                quantity: event.target.value,
                            });
                        }}
                        required
                    />
                    <label htmlFor="price">
                        <b>Price (in Wei)</b>
                    </label>
                    <input
                        type="number"
                        placeholder="Enter Batch Price (in Wei)"
                        name="price"
                        value={formvalues.price}
                        onChange={(event) => {
                            setformvalues({
                                ...formvalues,
                                price: event.target.value,
                            });
                        }}
                        required
                    />
                    <label htmlFor="expiry">
                        <b>Expiry Date</b>
                    </label>
                    <input
                        type="date"
                        name="expiry"
                        value={new Date(Date.parse(formvalues.expiry))
                            .toISOString()
                            .slice(0, 10)}
                        onChange={(event) => {
                            setformvalues({
                                ...formvalues,
                                expiry: String(event.target.value),
                            });
                        }}
                        min={new Date().toISOString().slice(0, 10)}
                        required
                    />
                    <div className="clearfix">
                        {loading == true ? (
                            <button type="submit" className="btn">
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Processing...
                            </button>
                        ) : (
                            <button type="submit" className="btn">
                                Add
                            </button>
                        )}
                    </div>
                </div>
            </form>
            <div className="space"></div>
        </div>
    );
}
