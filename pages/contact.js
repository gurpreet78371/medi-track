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
    <div>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </Head>
      {/* <!-- navbar section start --> */}
      <nav className={scroll ? "home-navbar sticky" : "home-navbar"}>
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
            <div className="row">
              <div className="section-head col-sm-12">
                <h4>
                  <span>Why Choose</span> Us?
                </h4>
                <p>
                  When you choose us, you'll feel the benefit of 10 years'
                  experience of Web Development. Because we know the digital
                  world and we know that how to handle it. With working
                  knowledge of online, SEO and social media.
                </p>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_one">
                    <i className="fa fa-globe" />
                  </span>
                  <h6>Modern Design</h6>
                  <p>
                    We use latest technology for the latest world because we
                    know the demand of peoples.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_two">
                    <i className="fa fa-anchor" />
                  </span>
                  <h6>Creative Design</h6>
                  <p>
                    We are always creative and and always lisen our costomers
                    and we mix these two things and make beast design.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_three">
                    <i className="fa fa-hourglass-half" />
                  </span>
                  <h6>24 x 7 User Support</h6>
                  <p>
                    If our customer has any problem and any query we are always
                    happy to help then.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_four">
                    <i className="fa fa-database" />
                  </span>
                  <h6>Business Growth</h6>
                  <p>
                    Everyone wants to live on top of the mountain, but all the
                    happiness and growth occurs while you're climbing it
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_five">
                    <i className="fa fa-upload" />
                  </span>
                  <h6>Market Strategy</h6>
                  <p>
                    Holding back technology to preserve broken business models
                    is like allowing blacksmiths to veto the internal combustion
                    engine in order to protect their horseshoes.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="item">
                  {" "}
                  <span className="icon feature_box_col_six">
                    <i className="fa fa-camera" />
                  </span>
                  <h6>Affordable cost</h6>
                  <p>
                    Love is a special word, and I use it only when I mean it.
                    You say the word too much and it becomes cheap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer section starts */}
      <section className="main-footer">
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
