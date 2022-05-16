import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Medicine from "../../ethereum/medicine";
import web3 from "../../ethereum/web3";
import Link from "next/link";
import Head from "next/head";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const links = [
  { name: "Dashboard", address: "#", active: true },
  { name: "Inventory", address: "/manufacturer/", active: false },
  { name: "Orders", address: "/manufacturer/orders", active: false },
  { name: "Add Batch", address: "/manufacturer/create", active: false },
  { name: "Profile", address: "/manufacturer/profile", active: false },
];

export default function batchList() {
  const [address, setAddress] = useState("0x0");
  const [medicines, setMedicines] = useState([]);
  const [salesData, setSalesData] = useState();
  const [typeData, setTypeData] = useState();
  const [buyerData, setBuyerData] = useState();
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
      const meds = await supplychain.methods.getMedicinesMan(account).call();
      console.log(meds);
      let medsInfo = [];
      let sales = {
        labels: [
          "May 2022",
          "April 2022",
          "March 2022",
          "Feb 2022",
          "Jan 2022",
          "Dec 2021",
        ],
        datasets: [
          {
            label: "Sales in last 6 months",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(245, 199, 182)",
              "rgb(54, 192, 135)",
              "rgb(155, 245, 86)",
            ],
          },
        ],
      };
      let types = {
        labels: [],
        datasets: [
          {
            label: "Sales in last 6 months",
            data: [],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(245, 199, 182)",
              "rgb(54, 192, 135)",
              "rgb(155, 245, 86)",
            ],
          },
        ],
      };
      let buyers = {
        labels: [],
        datasets: [
          {
            label: "Sales",
            data: [],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(245, 199, 182)",
              "rgb(54, 192, 135)",
              "rgb(155, 245, 86)",
            ],
          },
        ],
      };
      for (let med in meds) {
        const medicine = Medicine(meds[med]);
        const info = await medicine.methods.getInfo().call();
        if (info[3][1] != "0x0000000000000000000000000000000000000000") {
          sales["datasets"][0]["data"][0] += info[6] / 1000000000000;
          if (types["labels"].indexOf(info[0]) == -1) {
            types["labels"].push(info[0]);
            types["datasets"][0]["data"].push(info[6] / 1000000000000);
          } else {
            types["datasets"][0]["data"][types["labels"].indexOf(info[0])] +=
              info[6] / 1000000000000;
          }
          if (buyers["labels"].indexOf(info[3][1]) == -1) {
            buyers["labels"].push(info[3][1]);
            buyers["datasets"][0]["data"].push(info[6] / 1000000000000);
          } else {
            buyers["datasets"][0]["data"][
              buyers["labels"].indexOf(info[3][1])
            ] += info[6] / 1000000000000;
          }
        }
        console.log(info);
        medsInfo.push({ ...info, address: meds[med] });
      }
      console.log(medsInfo);
      setMedicines(medsInfo);
      setSalesData(sales);
      setTypeData(types);
      for (let index in buyers["labels"]) {
        let user = await supplychain.methods
          .getUserInfo(buyers["labels"][index])
          .call();
        console.log(user);
        buyers["labels"][index] = user[0];
      }
      setBuyerData(buyers);
    }
    setLoading(false);
  }, []);

  return (
    <div className="body">
      <Head>
        <title>Dashboard</title>
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
            <div>
              <h3 className="my-2">Sales this month: </h3>
              {typeData != null ? (
                <div className="flex justify-evenly my-32">
                  <div className="">
                    <Pie
                      data={typeData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: "Medicines Sold",
                          },
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                        },
                      }}
                    ></Pie>
                  </div>
                  <div>
                    <table className="table table-striped table-hover mt-2 p-2">
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Sales (in Eth)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {typeData["labels"].map((med, index) => {
                          return (
                            <tr>
                              <th>{med}</th>
                              <td>{typeData["datasets"][0]["data"][index]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
              <hr></hr>
              <h3 className="my-2">Sales in last 6 months:</h3>
              {salesData != null ? (
                <div className="flex justify-evenly my-32">
                  <div className="h-3/5 w-3/5">
                    <Bar
                      data={salesData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: "Sales in last 6 months",
                          },
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                        },
                      }}
                    ></Bar>
                  </div>
                  <div>
                    <table className="table table-striped table-hover mt-2 p-2">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Sales (in Eth)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData["labels"].map((year, index) => {
                          return (
                            <tr>
                              <th>{year}</th>
                              <td>{salesData["datasets"][0]["data"][index]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
              <hr></hr>
              <h3 className="my-2">Major Buyers:</h3>
              {buyerData != null ? (
                <div className="flex justify-evenly mt-32">
                  <div className="">
                    <Pie
                      data={buyerData}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: "Major Buyers",
                          },
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                        },
                      }}
                    ></Pie>
                  </div>
                  <div>
                    <table className="table table-striped table-hover mt-2 p-2">
                      <thead>
                        <tr>
                          <th>Buyer</th>
                          <th>Orders value (in Eth)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buyerData["labels"].map((buyer, index) => {
                          console.log(buyer);
                          return (
                            <tr>
                              <th>{buyer}</th>
                              <td>{buyerData["datasets"][0]["data"][index]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
