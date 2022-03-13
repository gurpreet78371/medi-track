import React from "react";
import NavBar from "../components/NavBar";

export default function medicine_info() {
  const links = [
    { name: "Register", address: "#", active: true },
    { name: "User", address: "/owner", active: false },
  ];
  return (
    <div className="body">
      <div className="nav-box">
        <NavBar links={links} />
      </div>

      <div className="medicine">
        <div className="medicine-info">
          <div className="left-half">
            <h3 className="name">Medicine Name</h3>
            <div className="row1">
              <div>Name: </div>
              <div>Medicine</div>
            </div>
            <div className="row1">
              <div className="left">Quantity: </div>
              <div className="right">100</div>
            </div>
            <div className="row1">
              <div className="left">Owner:</div>
              <div className="right">owner name</div>
            </div>
            <div className="row1">
              <div className="left">Shipper</div>
              <div className="right">shipper Name</div>
            </div>
            <div className="row1">
              <div className="left">Condition:</div>
              <div className="right">good</div>
            </div>
            <div className="row1">
              <div className="left">Current Owner:</div>
              <div className="right">Gurpreet Singh</div>
            </div>
            <div className="row1">
              <div className="left">Expiry</div>
              <div className="right">parso ki</div>
            </div>
          </div>
          <div className="right-half">
            <img src="/banner.jpeg" alt="QR code" />
          </div>
        </div>
        <div className="divider"></div>
        <div className="history">
          <div className="delhivery">
            <div className="delhivery-card">
              <div className="title">Purchase Reciept</div>
              <div className="info">
                <div className="row">
                  <div className="col-7">
                    {" "}
                    <span id="heading">Date</span>
                    <br /> <span id="details">10 October 2018</span>{" "}
                  </div>
                  <div className="col-5 pull-right">
                    {" "}
                    <span id="heading">Order No.</span>
                    <br /> <span id="details">012j1gvs356c</span>{" "}
                  </div>
                </div>
              </div>
              <div className="pricing">
                <div className="row">
                  <div className="col-9">
                    {" "}
                    <span id="name">BEATS Solo 3 Wireless Headphones</span>{" "}
                  </div>
                  <div className="col-3">
                    {" "}
                    <span id="price">£299.99</span>{" "}
                  </div>
                </div>
                <div className="row">
                  <div className="col-9">
                    {" "}
                    <span id="name">Shipping</span>{" "}
                  </div>
                  <div className="col-3">
                    {" "}
                    <span id="price">£33.00</span>{" "}
                  </div>
                </div>
              </div>
              <div className="total">
                <div className="row">
                  <div className="col-9" />
                  <div className="col-3">
                    <big>£262.99</big>
                  </div>
                </div>
              </div>
              <div className="tracking">
                <div className="title">Tracking Order</div>
              </div>
              <div className="progress-track">
                <ul id="progressbar">
                  <li className="step0 active " id="step1">
                    Ordered
                  </li>
                  <li className="step0 active text-center" id="step2">
                    Shipped
                  </li>
                  <li className="step0 active text-right" id="step3">
                    On the way
                  </li>
                  <li className="step0 text-right" id="step4">
                    Delivered
                  </li>
                </ul>
              </div>
              <div className="footer">
                <div className="row">
                  <div className="col-2">
                    <img
                      className="img-fluid"
                      src="https://i.imgur.com/YBWc55P.png"
                    />
                  </div>
                  <div className="col-10">
                    Want any help? Please &nbsp;<a> contact us</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
