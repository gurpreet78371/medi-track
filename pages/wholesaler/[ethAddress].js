import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import Medicine from "../../ethereum/medicine";
import web3 from "../../ethereum/web3";
import Link from "next/link";

const links = [
  { name: "Batches", address: "#", active: true },
  { name: "Receive", address: "/wholesaler/receive", active: false },
  { name: "Send", address: "/wholesaler/send", active: false },
  { name: "Profile", address: "/wholesaler/profile", active: false },
];

export default function batchList() {
  const [sellerInfo, setSellerInfo] = useState({ 0: "" });
  const [receiverAddress, setReceiverAddress] = useState();
  const [medicines, setMedicines] = useState([]);
  const [medicinesDisplay, setMedicinesDisplay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [orderPrice, setOrderPrice] = useState(0);
  const [checkOut, setCheckOut] = useState(false);
  const [paying, setPaying] = useState(false);
  const router = useRouter();
  const ethAddress = router.query.ethAddress;

  useEffect(async () => {
    setLoading(true);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    const info = await supplychain.methods.getUserInfo(account).call();
    console.log(info);
    console.log(account);
    if (info[4] != "2") {
      console.log("You are not a wholesaler");
    } else {
      console.log("You are wholesaler");
      setReceiverAddress(account);
      const info = await supplychain.methods.getUserInfo(ethAddress).call();
      setSellerInfo(info);
      const meds = await supplychain.methods.getMedicinesMan(ethAddress).call();
      console.log(meds);
      let medsInfo = [];
      for (let med in meds) {
        const medicine = Medicine(meds[med]);
        const info = await medicine.methods.getInfo().call();
        if (info[2] != 0) {
          continue;
        }
        info[6] = parseInt(info[6]);
        console.log(info);
        medsInfo.push({ ...info, address: meds[med] });
      }
      console.log(medsInfo);
      setMedicines(medsInfo);
      setMedicinesDisplay(medsInfo);
    }
    setLoading(false);
  }, []);

  useEffect(async () => {
    let details = [];
    for (let add of selected) {
      const medicine = Medicine(add);
      const info = await medicine.methods.getInfo().call();
      info.address = add;
      details.push(info);
    }
    setSelectedDetails(details);
  }, [selected]);

  const makePayment = async () => {
    setPaying(true);
    console.log("Making Payment")
    await supplychain.methods.placeOrder(
      orderPrice,
      ethAddress,
      receiverAddress,
      selected,
      String(new Date())
    ).send({from: receiverAddress});
    setCheckOut(false);
    setPaying(false);
  };

  return (
    <div className="body">
      <NavBar links={links} />
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          {checkOut ? (
            <div className="p-5 border rounded-lg bg-white border-gray-500 shadow-lg relative">
              <div className="flex justify-between">
                <div>
                  <h3>CheckOut</h3>
                  <p>Please confirm your order</p>
                </div>
                <h3>{orderPrice / 1000000000000} Eth</h3>
              </div>
              <p>Seller: {sellerInfo[0]}</p>
              <h2>Batches:</h2>
              {selectedDetails.map((batch) => {
                return (
                  <div className="my-2">
                    <div className="flex justify-between">
                      <div>{batch[0]}</div>
                      <p className="my-0">{batch[6] / 1000000000000} Eth</p>
                    </div>
                    <p className="my-0">{batch[1]} units</p>
                  </div>
                );
              })}
              <div className="flex">
                <button
                  className="bg-white text-red-500 p-2 rounded m-2 border border-gray-600 grow"
                  onClick={() => {
                    setCheckOut(false);
                  }}
                >
                  Go Back
                </button>
                {paying ? (
                  <button className="bg-red-500 text-white p-2 rounded m-2 grow">
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Placing Order...
                  </button>
                ) : (
                  <button
                    className="bg-red-500 text-white p-2 rounded m-2 grow"
                    onClick={makePayment}
                  >
                    Make Payement
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="table-responsive custom-table-responsive">
              <div className="flex justify-between my-2">
                <div className="mx-2">
                  <h3>Select Medicines</h3>
                  <p>Selected Items: {selected.length}</p>
                </div>

                <div className="mx-2">
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => {
                      setCheckOut(true);
                    }}
                  >
                    Order{" "}
                    {orderPrice != 0 ? (
                      <span>({orderPrice / 1000000000000} Eth)</span>
                    ) : (
                      <div></div>
                    )}
                  </button>
                  <p> </p>
                </div>
              </div>
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price (in Eth)</th>
                    <th scope="col">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {medicinesDisplay.map((med, index) => {
                    return (
                      <>
                        <tr className="spacer">
                          <td colSpan={100}></td>
                        </tr>
                        <tr
                          key={med.address}
                          onClick={() => {
                            if (selected.indexOf(med.address) == -1) {
                              setOrderPrice((price) => price + med[6]);
                              setSelected((temp) => temp.concat(med.address));
                            } else {
                              let temp = [];
                              setOrderPrice((price) => price - med[6]);
                              for (let add of selected) {
                                if (add != med.address) {
                                  temp.push(add);
                                }
                              }
                              setSelected(temp);
                            }
                          }}
                        >
                          <td>{index + 1}</td>
                          <td>
                            <Link href={`/${med.address}`}>
                              <a>{med[0]}</a>
                            </Link>
                          </td>
                          <td>{med[1]}</td>
                          <td>{med[6] / 1000000000000}</td>
                          <td>
                            {selected.length == 1 ? (
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
              {loading == true ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
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
          )}
        </div>
      </div>
    </div>
  );
}
