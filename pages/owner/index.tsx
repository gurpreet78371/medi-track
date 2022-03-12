import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";

export default function register({ usersInfo }) {
    const [userData,setUserData]=useState(usersInfo);
    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 20);
        });
    }, []);

    const getManData=()=>{
        let manData=[];
        for (let user in usersInfo){
            if(usersInfo[user].role=="Manufacturer"){
                manData.push(usersInfo[user]);
            }
        }
        setUserData(manData);
    }
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
                                    <th scope="col">Location</th>
                                    <th scope="col">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((userobj, index) => {
                                    return (
                                        <>
                                        <tr key={userobj.ethAddress}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <a href="#">{userobj.name}</a>
                                            </td>
                                            <td>{userobj.ethAddress}</td>
                                            <td>{userobj.location}</td>
                                            <td>{userobj.role}</td>
                                        </tr>
                                        <tr className="spacer">
                                            <td colspan="100"></td>
                                        </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                        <button onClick={getManData}>Get Manufacturers</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const users = await supplychain.methods.getUsers().call();
    let usersInfo = [];
    for (let user in users) {
        const userInfo = await supplychain.methods
            .getUserInfo(users[parseInt(user)])
            .call();
        let rolestr;
        if (userInfo.role == 1) {
            rolestr = "Manufacturer";
        } else if (userInfo.role == 2) {
            rolestr = "Wholesaler";
        } else if (userInfo.role == 3) {
            rolestr = "Distributer";
        } else if (userInfo.role == 4) {
            rolestr = "Pharma";
        } else if (userInfo.role == 5) {
            rolestr = "Transporter";
        }
        let userobj = {
            name: userInfo.name,
            location: userInfo.location,
            ethAddress: userInfo.ethAddress,
            role: rolestr,
        };
        usersInfo.push(userobj);
    }
    return {
        props: {
            usersInfo,
        },
    };
}
