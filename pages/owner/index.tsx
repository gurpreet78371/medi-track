import React from "react";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function register() {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 20);
    });
  }, []);
  return (
    <div className="body">
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
      <div className="content">
        <div className="container" style={{ maxWidth: "80%" }}>
          <div className="table-responsive custom-table-responsive">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <a href="#">James Yates</a>
                  </td>
                  <td>
                    Web Designer
                    <small className="d-block">
                      Far far away, behind the word mountains
                    </small>
                  </td>
                  <td>+63 983 0962 971</td>
                  <td>Whole Saler</td>
                </tr>
                <tr className="spacer">
                  <td colSpan={100} />
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <a href="#">Matthew Wasil</a>
                  </td>
                  <td>
                    Graphic Designer
                    <small className="d-block">
                      Far far away, behind the word mountains
                    </small>
                  </td>
                  <td>+02 020 3994 929</td>
                  <td>Chemist</td>
                </tr>
                <tr className="spacer">
                  <td colSpan={100} />
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <a href="#">Sampson Murphy</a>
                  </td>
                  <td>
                    Mobile Dev
                    <small className="d-block">
                      Far far away, behind the word mountains
                    </small>
                  </td>
                  <td>+01 352 1125 0192</td>
                  <td>Whole Saler</td>
                </tr>
                <tr className="spacer">
                  <td colSpan={100} />
                </tr>
                <tr>
                  <td>4</td>
                  <td>
                    <a href="#">Gaspar Semenov</a>
                  </td>
                  <td>
                    Illustrator
                    <small className="d-block">
                      Far far away, behind the word mountains
                    </small>
                  </td>
                  <td>+92 020 3994 929</td>
                  <td>Pharmaceutical Company</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
