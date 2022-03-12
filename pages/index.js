import React from "react";
import Head from "next/head";
import { useState, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.js";

export default function index() {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 20);
    });
  }, []);

  return (
    <div>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.11/typed.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
        <script src="/script.js"></script>
        <title>Document</title>
      </Head>
      {/* <!-- navbar section start --> */}
      <nav className={scroll ? "navbar sticky" : "navbar"}>
        <div className="max-width">
          <div className="logo">
            <a href="#">MediTrack Blockchain Transparent Supply</a>
          </div>
          <ul className="menu">
            <li>
              <a href="" className="menu-btn">
                Connect to MetaMask
              </a>
            </li>
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
          <i className="fas fa-bars" />
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
          <i className="fas fa-bars" />
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
          <i className="fas fa-bars" />
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
          <i className="fas fa-bars" />
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
          <i className="fas fa-bars" />
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
          <i className="fas fa-bars" />
          <h1>35B</h1>
          <p>
            USD in total annual cost from products lost to temperature
            deviations in shipping.
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
            <img src="/banner.jpeg" alt="" />
          </div>
          <div className="right">
            <div className="card">
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
            <div className="card">
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
            <div className="card">
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
            <div className="card">
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
          </div>
        </div>
      </section>
    </div>
  );
}
