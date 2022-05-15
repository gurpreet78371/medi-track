import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Medicine from "../../ethereum/medicine";
import Order from "../../ethereum/order";
import web3 from "../../ethereum/web3";
import Link from "next/link";

const links = [
  { name: "Batches", address: "/manufacturer", active: false },
  { name: "Orders", address: "#", active: true },
  { name: "Create", address: "/manufacturer/create", active: false },
  { name: "Profile", address: "/manufacturer/profile", active: false },
];

export default function batchList() {
  const [address, setAddress] = useState("0x0");
  const [orderInfo, setOrderInfo] = useState([]);
  const [ordersDisplay, setOrdersDisplay] = useState([]);
  const [batchesDisplay, setBatchesDisplay] = useState({});
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
      const orders = await supplychain.methods
        .getOredrsReceived()
        .call({ from: account });
      console.log(orders);
      let ordersInfo = [];
      let batches = {};
      for (let index in orders) {
        const order = Order(orders[index]);
        let info = await order.methods.getInfo().call();
        info.address = orders[index];
        batches[info.address] = false;
        for (let ind in info[1]) {
          let batchInfo = Medicine(info[1][ind]).methods.getInfo.call();
          batchInfo.address = info[1][ind];
          info[1][ind] = batchInfo;
        }
        let receiver = await supplychain.methods.getUserInfo(info[3]).call;
        receiver.address = info[3];
        info[3] = receiver;
        ordersInfo.push(info);
      }
      console.log(ordersInfo);
      setOrderInfo(ordersInfo);
      setOrdersDisplay(ordersInfo);
      setBatchesDisplay(batches);
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
    } else if (e.target.value == "Not Shipped") {
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
                  <div className="my-2" key={order.address}>
                    <div className="bg-white shadow-md py-3 px-4 rounded-md flex justify-between">
                      <div>
                        <h2>{info[3][0]}</h2>
                        <p className="mb-0">{info[1].length} batches</p>
                      </div>
                      {batchesDisplay[order.address] ? (
                        <button
                          onClick={() => {
                            let temp = batchesDisplay;
                            temp[order.address] = false;
                            setBatchesDisplay(temp);
                          }}
                        >
                          Hide Batches
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            let temp = batchesDisplay;
                            temp[order.address] = true;
                            setBatchesDisplay(temp);
                          }}
                        >
                          Show Batches
                        </button>
                      )}
                    </div>
                    {batchesDisplay[order.address] ? (
                      <div>
                        {order[1].map((batch) => {
                          return (
                            <div
                              className="bg-white rounded-b-md py-2 px-4"
                              key={batch.address}
                            >
                              <div>
                                <h6>{batch[0]} Wei:</h6>
                              </div>
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
