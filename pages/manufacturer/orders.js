import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Medicine from "../../ethereum/medicine";
import Order from "../../ethereum/order";
import web3 from "../../ethereum/web3";
import Link from "next/link";
import Head from "next/head";

const links = [
  { name: "Batches", address: "/manufacturer", active: false },
  { name: "Orders", address: "#", active: true },
  { name: "Add Batch", address: "/manufacturer/create", active: false },
  { name: "Profile", address: "/manufacturer/profile", active: false },
];

export default function batchList() {
  const [address, setAddress] = useState("0x0");
  const [ownerInfo,setOwnerInfo]=useState({0:""});
  const [orderInfo, setOrderInfo] = useState([]);
  const [ordersDisplay, setOrdersDisplay] = useState([]);
  const [batchesDisplay, setBatchesDisplay] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
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
      const userInfo=await supplychain.methods.getUserInfo(account).call();
      setOwnerInfo(userInfo);
      const orders = await supplychain.methods
        .getOredrsReceived()
        .call({ from: account });
      console.log(orders);
      let ordersInfo = [];
      for (let index in orders) {
        const order = Order(orders[index]);
        let info = await order.methods.getInfo().call();
        info.address = orders[index];
        console.log(info);
        info.batchDetails = [];
        for (let ind in info[1]) {
          let batchInfo = await Medicine(info[1][ind]).methods.getInfo().call();
          console.log(batchInfo);
          batchInfo.address = info[1][ind];
          info.batchDetails.push(batchInfo);
        }
        let receiver = await supplychain.methods.getUserInfo(info[3]).call();
        info.receiver = receiver;
        ordersInfo.push(info);
      }
      console.log(ordersInfo);
      setOrderInfo(ordersInfo);
      setOrdersDisplay(ordersInfo);
    }
    setLoading(false);
  }, []);

  const filterOrders = (e) => {
    console.log(e.target.value);
    setSelectedFilter(e.target.value);
    if (e.target.value == "All") {
      setOrdersDisplay(orderInfo);
    } else if (e.target.value == "Not Shipped") {
      let orders = [];
      for (let index in orderInfo) {
        if (orderInfo[index][5] == 0) {
          orders.push(orderInfo[index]);
        }
      }
      setOrdersDisplay(orders);
    } else if (e.target.value == "Shipped") {
      let orders = [];
      for (let index in orderInfo) {
        if (orderInfo[index][5] == 1) {
          orders.push(orderInfo[index]);
        }
      }
      setOrdersDisplay(orders);
    } else if (e.target.value == "Delivered") {
      let orders = [];
      for (let index in orderInfo) {
        if (orderInfo[index][5] == 2) {
          orders.push(orderInfo[index]);
        }
      }
      setOrdersDisplay(orders);
    }
  };
  return (
    <div className="body">
      <Head>
        <title>Orders</title>
      </Head>
      <NavBar links={links} />
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          {loading == true ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <h3 className="mb-3">{selectedFilter} Orders</h3>
              <div className="filter-box">
                <div className="filter">
                  <label htmlFor="filter" className="filter-label">
                    Filter:
                  </label>
                  <select name="filter" id="filter" onChange={filterOrders}>
                    <option value="All">All Orders</option>
                    <option value="Not Shipped">Not Shipped</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {ordersDisplay.map((order) => {
            return (
              <div
                className="my-2 bg-white shadow-md py-3 px-4 rounded-md"
                key={order.address}
              >
                <div className="flex justify-between">
                  <div>
                    <Link href={`/order/${order.address}`}><h2 className="text-black decoration-black cursor-pointer">{order.receiver[0]}</h2></Link>
                    <p className="mb-0">{order[0] / 1000000000000} Eth</p>
                  </div>
                  <div className="flex">
                    {order[4] ==
                    "0x0000000000000000000000000000000000000000" ? (
                      <button className="bg-red-500 text-white decoration-white p-2 rounded my-1 hover:bg-red-600">
                        <Link href={`/manufacturer/${order.address}`}>
                          <a className="text-white decoration-white">
                            Process Order
                          </a>
                        </Link>
                      </button>
                    ) : null}
                    {batchesDisplay.indexOf(order.address) != -1 ? (
                      <span
                        className="cursor-pointer mx-2 my-3"
                        onClick={() => {
                          let temp = [];
                          for (let add of batchesDisplay) {
                            if (add != order.address) {
                              temp.push(add);
                            }
                          }
                          setBatchesDisplay(temp);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-chevron-up"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span
                        className="cursor-pointer mx-2 my-3"
                        onClick={() => {
                          setBatchesDisplay((batch) =>
                            batch.concat(order.address)
                          );
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-chevron-down"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
                {batchesDisplay.indexOf(order.address) != -1 ? (
                  <div>
                    <hr></hr>
                    {order.batchDetails.map((batch, index) => {
                      return (
                        <div className="my-2" key={order[1][index]}>
                          <div className="flex justify-between my-1">
                            <div>
                              <span className="font-medium text-lg">{batch[0]}</span>
                              <span className="text-gray-400"> ( {batch[1]} units )</span>
                            </div>
                            <p className="m-0">
                              {batch[6] / 1000000000000} Eth
                            </p>
                          </div>
                          <p className="m-0">Manufactured By: {ownerInfo[0]}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
