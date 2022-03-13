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
              <div className="left">Name: </div>
              <div className="right">Medicine</div>
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
            <img src="/qr.jpg" alt="QR code" />
          </div>
        </div>

        <div className="divider"></div>

        <div className="history">
          <div className="left">
            <section className="experience" id="experience">
              <div className="max-width1">
                <div className="experience-content">
                  <div className="outer">
                    <div className="card">
                      <div className="experience-details">
                        <div className="experience-level">
                          Intern - Network and System Engineer
                        </div>
                        <div className="date italic">Jan 2021 - Jun 2021</div>
                        <div className="company">Cvent</div>
                      </div>
                      <div className="square" />
                    </div>
                    <div className="circle">
                      <i className="fas fa-envelope" />
                    </div>
                  </div>
                  <div className="outer">
                    <div style={{ marginBottom: "0px" }} className="card">
                      <div className="experience-details">
                        <div className="experience-level">Teacher</div>
                        <div className="date italic">2016 - 2020</div>
                        <div className="company">Part Time</div>
                      </div>
                      <div className="square" />
                    </div>
                    <div className="circle">
                      <i className="fas fa-envelope" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="right">
            <img src="/map.gif" alt="location" />
          </div>
        </div>
      </div>
    </div>
  );
}
