import React from "react";
import Head from "next/head";
import web3 from "../ethereum/web3";
import supplychain from "../ethereum/supplychain";
import { useState, useEffect } from "react";

export default function contact() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 20);
    });
  }, []);

  const getAddress = async () => {
    if (window.ethereum == "undefined") {
      alert("MetaMask is not installed!!!");
    } else {
      setLoading(true);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = web3.utils.toChecksumAddress(accounts[0]);
      setAddress(account);
      const owner = await supplychain.methods.owner().call();
      console.log(typeof account);
      console.log(typeof owner);
      console.log(owner == account);
      console.log(owner);
      console.log(account);
      console.log();
      if (owner == account) {
        console.log("You are owner");
        setRole("owner");
        setLoading(false);
      } else {
        const info = await supplychain.methods.getUserInfo(account).call();
        console.log(info);
        if (info.role == 1) {
          setRole("manufacturer");
        } else if (info.role == 2) {
          setRole("wholesaler");
        } else if (info.role == 3) {
          setRole("distributer");
        } else if (info.role == 4) {
          setRole("pharma");
        } else if (info.role == 5) {
          setRole("transporter");
        } else {
          alert("You are not registered!!!");
        }
        setLoading(false);
      }
    }
  };

  return (
    <div className="contact-section">
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </Head>
      {/* <!-- navbar section start --> */}
      <nav className="home-navbar sticky">
        <div className="max-width">
          <div className="logo">
            <a href="#">MediTrack Blockchain Transparent Supply</a>
          </div>
          <ul className="menu">
            {address == "" && loading == false ? (
              <li>
                <a className="menu-btn" onClick={getAddress}>
                  Connect to MetaMask
                </a>
              </li>
            ) : (
              <li></li>
            )}
            {loading ? <li className="menu-btn">Loading...</li> : <li></li>}
            {address != "" && loading == false ? (
              <li>
                <a href={`/${encodeURIComponent(role)}`} className="menu-btn">
                  Go to site
                </a>
              </li>
            ) : (
              <li></li>
            )}
          </ul>
          <div className="menu-btn">
            <i className="fas fa-bars" />
          </div>
        </div>
      </nav>

      {/* contact section starts */}
      <section className="contact-us">
        <div className="feat bg-gray pt-5 pb-5">
          <div className="container">
            <div className="row pt-20">
              <div className="section-head col-sm-12">
                <h4>
                  <span>About</span> Us?
                </h4>
                <p>
                  We are Medi Track. Amid rising counterfeiting, regulatory
                  changes and a cold chain logistical test like no other on the
                  horizon–the worldwide distribution of coronavirus vaccines–the
                  pharmaceutical industry faces an array of challenges, many of
                  which lead back to lack of visibility in a complex global
                  supply chain. By providing transparency and enabling trust,
                  blockchain technology can help.
                </p>
                <h5>Contact Details:</h5>
                <div className="support-fields">
                  <div className="left">Customer Support:</div>
                  <div className="right">+918837885175, +917717512172</div>
                </div>
                <br />
                <div className="support-fields">
                  <div className="left">Email:</div>
                  <div className="right">customer_service@meditrack.com</div>
                </div>
              </div>
              <div className="section-head col-sm-12">
                <h4>
                  <span>Our Team</span>
                </h4>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_two">
                    <i class="bi bi-person-circle"></i>
                  </span>
                  <h6>Dr. Rupali Verma</h6>
                  <div className="fields">
                    <div className="left">Phone:</div>
                    <div className="right">+918837885175</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_three">
                    <i className="fa fa-hourglass-half" />
                  </span>
                  <h6>Dr. Arun</h6>
                  <div className="fields">
                    <div className="left">Phone:</div>
                    <div className="right">+918837885175</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  <span className="icon feature_box_col_one">
                    <i className="fa fa-globe" />
                  </span>
                  <h6>Gurpreet Singh</h6>
                  <div className="fields">
                    <div className="left">Phone:</div>
                    <div className="right">+918837885175</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_two">
                    <i className="fa fa-anchor" />
                  </span>
                  <h6>Piyush Girdhar</h6>
                  <div className="fields">
                    <div className="left">Phone:</div>
                    <div className="right">+918837885175</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_three">
                    <i className="fa fa-hourglass-half" />
                  </span>
                  <h6>Anmol Salhvi</h6>
                  <div className="fields">
                    <div className="left">Phone:</div>
                    <div className="right">+918837885175</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  <span className="icon feature_box_col_one">
                    <i className="fa fa-globe" />
                  </span>
                  <h6>Ajay Thandaik</h6>
                  <div className="fields">
                    <div className="left">Phone:</div>
                    <div className="right">+918837885175</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                  <br />
                  <div className="fields">
                    <div className="left">key</div>
                    <div className="right">value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer section starts */}
      <section className="main-footer1">
        <div className="lower">
          <div className="footer-dark">
            <footer>
              <div className="container">
                <div className="row">
                  <div className="col-sm-6 col-md-3 item">
                    <h3>Services</h3>
                    <ul>
                      <li>
                        <a href="#">Blockchain based drug supply</a>
                      </li>
                      <li>
                        <a href="#">Tracebility</a>
                      </li>
                      <li>
                        <a href="#">Visibility</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6 col-md-3 item">
                    <h3>About</h3>
                    <ul>
                      <li>
                        <a href="#">Company</a>
                      </li>
                      <li>
                        <a href="#">Team</a>
                      </li>
                      <li>
                        <a href="#">Careers</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6 item text">
                    <h3>Meditrack</h3>
                    <p>
                      Amid rising counterfeiting, regulatory changes and a cold
                      chain logistical test like no other on the horizon–the
                      worldwide distribution of coronavirus vaccines–the
                      pharmaceutical industry faces an array of challenges, many
                      of which lead back to lack of visibility in a complex
                      global supply chain. By providing transparency and
                      enabling trust, blockchain technology can help.
                    </p>
                  </div>
                  <div className="col item social">
                    <a href="#">
                      <i className="icon ion-social-facebook" />
                    </a>
                    <a href="#">
                      <i className="icon ion-social-twitter" />
                    </a>
                    <a href="#">
                      <i className="icon ion-social-snapchat" />
                    </a>
                    <a href="#">
                      <i className="icon ion-social-instagram" />
                    </a>
                  </div>
                </div>
                <p className="copyright">Meditrack © 2022</p>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </div>
  );
}
