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
            ? "navbar sticky navbar-dark bg-secondary"
            : "navbar navbar-dark bg-secondary"
        }
      >
        <div className="max-width">
          <div className="logo">
            <a href="#">MediTrack</a>
          </div>
          <ul className="menu">
            {props.links.map((link) => {
              return (
                <li>
                  <a
                    href={link.address}
                    className={
                      props.active === "users"
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
