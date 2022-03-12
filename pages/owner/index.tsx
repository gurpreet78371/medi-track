import React from "react";
import supplychain from "../../ethereum/supplychain";
import { useState, useEffect } from "react";

export default function register({usersInfo}) {
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
                  <th scope="col">Location</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                {usersInfo.map((userobj,index)=>{
                    return (
                        <tr key={userobj.ethAddress}>
                            <td>{index+1}</td>
                            <td>
                                <a href="#">{userobj.name}</a>
                            </td>
                            <td>
                                {userobj.ethAddress}
                            </td>
                            <td>{userobj.location}</td>
                            <td>{userobj.role}</td>
                        </tr>
                    );
                })}
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

export async function getStaticProps(){
    const users=await supplychain.methods.getUsers().call();
    let usersInfo=[];
    for (let user in users){
        const userInfo=await supplychain.methods.getUserInfo(users[parseInt(user)]).call();
        let rolestr;
        if(userInfo.role==1){
            rolestr="Manufacturer";
        }
        else if(userInfo.role==2){
            rolestr="Wholesaler";
        }
        else if(userInfo.role==3){
            rolestr="Distributer";
        }
        else if(userInfo.role==4){
            rolestr="Pharma";
        }
        else if(userInfo.role==5){
            rolestr="Transporter";
        }
        let userobj={
            name: userInfo.name,
            location: userInfo.location,
            ethAddress:userInfo.ethAddress,
            role: rolestr
        };
        usersInfo.push(userobj);
    }
    return {
        props:{
            usersInfo
        }
    }
}
