import React from "react";
import { useState, useEffect } from "react";

export default function NavBar(props) {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 20);
    });
  }, []);
  return (
    <div>
      {/* <!-- navbar section start --> */}
      <nav
        className={
          scroll
            ? "navbar sticky navbar-light bg-white"
            : "navbar navbar-light bg-white"
        }
      >
        <div className="max-width">
          <div className="logo">
            <a href="#">MediTrack</a>
          </div>
          <ul className="menu">
            {props.links.map((link) => {
              return (
                <li key={link.address}>
                  <a
                    href={link.address}
                    className={
                      link.active==true
                        ? "menu-btn inactive"
                        : "menu-btn"
                    }
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="menu-btn">
            <i className="fas fa-bars" />
          </div>
        </div>
      </nav>
    </div>
  );
}
