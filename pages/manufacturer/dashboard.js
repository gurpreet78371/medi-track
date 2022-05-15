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
  { name: "Batches", address: "/manufacturer/", active: false },
  { name: "Orders", address: "/manufacturer/orders", active: false },
  { name: "Add Batch", address: "/manufacturer/create", active: false },
  { name: "Profile", address: "/manufacturer/profile", active: false },
];

export default function batchList() {
  const [address, setAddress] = useState("0x0");
  const [medicines, setMedicines] = useState([]);
  const [salesData, setSalesData] = useState({});
  const [typeData, setTypeData] = useState({});
  const [buyerData, setBuyerData] = useState({});
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
            data: [0,0,0,0,0,0],
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
      let buyers={
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
      }
      for (let med in meds) {
        const medicine = Medicine(meds[med]);
        const info = await medicine.methods.getInfo().call();
        if(info[3][1]!='0x0000000000000000000000000000000000000000'){
            sales['datasets'][0]['data'][0]+=info[6]/1000000000000;
        }
        console.log(info);
        medsInfo.push({ ...info, address: meds[med] });
      }
      console.log(medsInfo);
      setMedicines(medsInfo);
    }
    setLoading(false);
  }, []);

  const data = {
    labels: [
      "Tablets",
      "Solution",
      "Injections",
      "Tablets",
      "Solution",
      "Injections",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100, 200, 125, 250],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(245, 199, 182)",
          "rgb(54, 192, 135)",
          "rgb(155, 245, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div className="body">
      <Head>
        <title>Dashboard</title>
      </Head>
      <NavBar links={links} />
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          <div className="flex justify-evenly">
            <div className="">
              <Pie
                data={data}
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
              <table className="table table-striped mt-2">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>May 2022</th>
                    <th>April 2022</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Tablet</th>
                    <td>100</td>
                    <td>50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="">
              <Bar
                data={data}
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
              ></Bar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
