import React from "react";
import Head from "next/head";
import web3 from "../ethereum/web3";
import supplychain from "../ethereum/supplychain";
import { useState, useEffect } from "react";

export default function index() {
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
        if (info[4] == 1) {
          setRole("manufacturer");
        } else if (info[4] == 2) {
          setRole("wholesaler");
        } else if (info[4] == 3) {
          setRole("distributer");
        } else if (info[4] == 4) {
          setRole("pharma");
        } else if (info[4] == 5) {
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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MediTrack</title>
      </Head>
      {/* <!-- navbar section start --> */}
      <nav className={scroll ? "home-navbar sticky" : "home-navbar"}>
        <div className="max-width">
          <div className="logo">
            <a href="#">MediTrack Blockchain Transparent Supply</a>
          </div>
          <ul className="menu">
          <li>
                <a className="menu-btn" href="/contact">
                  Contact Us
                </a>
              </li>
            {address == "" && loading == false ? (
              <li>
                <a className="menu-btn" onClick={getAddress}>
                  Connect to MetaMask
                </a>
              </li>
            ) : (
              <li></li>
            )}
            {loading ? <li className="menu-btn mx-2">Loading...</li> : <li></li>}
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
      {/* home section start */}
      <section className="home" id="home">
        <div className="max-width">
          <div className="home-content">
            <div className="text-1">
              The pharmaceutical industry on blockchain
            </div>
            <div className="text-2">
              Amid rising counterfeiting, regulatory changes and a cold chain
              logistical test like no other on the horizon–the worldwide
              distribution of coronavirus vaccines–the pharmaceutical industry
              faces an array of challenges, many of which lead back to lack of
              visibility in a complex global supply chain. By providing
              transparency and enabling trust, blockchain technology can help.
            </div>
          </div>
        </div>
      </section>
      {/* stats section starts */}
      <section className="stats">
        <div className="card">
          <h1>35B</h1>
          <p>
            USD in total annual cost from products lost to temperature
            deviations in shipping.
          </p>
          <p>
            Source: <a href="#">FreightWaves</a>
          </p>
        </div>
        <div className="card">
          <h1>28%</h1>
          <p>
            of pharmaceutical sales are for temperature controlled products.
          </p>
          <p>
            Source: <a href="#">FreightWaves</a>
          </p>
        </div>
        <div className="card">
          <h1>25%</h1>
          <p>
            of vaccines reach their destination degraded because of incorrect
            shipping.
          </p>
          <p>
            Source: <a href="#">IATA</a>
          </p>
        </div>
        <div className="card">
          <h1>1750</h1>
          <p>incidents of pharmaceutical counterfeiting in the U.S. in 2018.</p>
          <p>
            Source: <a href="#">Stastista</a>
          </p>
        </div>
        <div className="card">
          <h1>3 months</h1>
          <p>
            of stockpiled helped companies weather the initial period of the
            coronavirus outbreak.
          </p>
          <p>
            Source: <a href="#">ACP Journals</a>
          </p>
        </div>
        <div className="card">
          <h1>80%</h1>
          <p>
            of active pharmaceutical ingredients and 40% of finished drugs are
            imported into the U.S.
          </p>
          <p>
            Source: <a href="#">FreightWaves</a>
          </p>
        </div>
      </section>
      {/* leran more section starts */}
      <section className="learn-more">
        <div className="upper">
          <div className="outer">
            <div className="left">
              <div className="max-width">
                <div className="content">
                  <div className="text-1">
                    How can MediTrack Blockchain Transparent Supply help?
                  </div>
                  <div className="text-2">
                    In the pharmaceutical industry, where supply chain
                    visibility, speed and coordination are critical to the
                    delivery of safe and effective products, blockchain is
                    essential. MediTrack Blockchain Transparent Supply is
                    helping organizations build blockchain-based ecosystem
                    networks quickly and easily.
                  </div>
                  <div className="button">Learn more</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lower">
          <div className="left">
            <img src="/doctor.jpg" alt="" />
          </div>
          <div className="right">
            <div className="info-card">
              <div className="heading">
                Establish supply chain integrity with cold chain monitoring
              </div>
              <p className="content">
                Identify contamination of high-value temperature-sensitive
                products like biologics with step-by-step visibility of cold
                chain sensor data from manufacture to delivery. If temperature
                incursion occurs, assign financial responsibility and
                chargebacks where they belong.
              </p>
            </div>
            <div className="info-card">
              <div className="heading">
                Fight against fraud and theft with provenance authentication
              </div>
              <p className="content">
                Ensure that the products on the shelves and in the pharmacy are
                authentic. Data sharing and visibility into a product’s journey
                from the production line to the patient make it possible to
                decrease fraud through an immutable record of events.
              </p>
            </div>
            <div className="info-card">
              <div className="heading">
                Drive time and cost out of the supply chain with data and
                digitization
              </div>
              <p className="content">
                Analytics can reveal new business opportunities to improve
                inventory management and increase efficiency while giving early
                warning to disruptions in ingredient sourcing. Permissioned
                participants have near real-time visibility into documents that
                are digitized and stored on the blockchain.
              </p>
            </div>
            <div className="info-card">
              <div className="heading">
                Address regulation requirements for drug tracking
              </div>
              <p className="content">
                Blockchain technology, with its shareable ledger and immutable
                data, is ideally suited to the task of tracking unique digital
                IDs assigned to product units and identifying the location of
                products under recall in seconds, not days.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* footer section starts */}
      <section className="main-footer">
        <div className="upper">
          <div className="upper-left">
            <h3>
              Find out how companies are using blockchain to drive end-to-end
              supply chain efficiency.
            </h3>
            <div className="link">
              <a
                href="https://event.on24.com/eventRegistration/EventLobbyServletV2?target=lobby20V2.jsp&eventid=2472835&sessionid=1&format=fhvideo1&key=A939971A8D67A34642EFFB54828D60EC&eventuserid=519684908"
                target="_blank"
              >
                Watch: Increasing supply chain efficiency
              </a>
            </div>
          </div>
          <div className="upper-right">
            <h3>
              See how Transparent Supply is building a next-generation supply
              chain.
            </h3>
            <div className="link">
              <a
                href="https://www.ibm.com/account/reg/us-en/signup?formid=urx-47335"
                target="_blank"
              >
                Read the brief
              </a>
            </div>
          </div>
        </div>
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
