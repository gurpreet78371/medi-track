import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import { useRouter } from "next/router";
import { useState } from "react";
import Medicine from "../ethereum/medicine";
import supplychain from "../ethereum/supplychain";

export default function medicine_info() {
  const [medInfo,setMedInfo]=useState({});
  const [ownersInfo,setOwnersInfo]=useState([]);
  const [currentOwner,setCurrentOwner]=useState(0);
  const router=useRouter();
  const batch=router.query.batch;
  useEffect(async()=>{
    console.log(router.query);
    console.log(batch);
    const medicine= Medicine(batch);
    const info=await medicine.methods.getInfo().call();
    if(info[3]==0){
      info[3]="At Manufacturer";
      setCurrentOwner(0);
    }
    else if(info[3]==1){
      info[3]="At Wholesaler";
      setCurrentOwner(1);
    }
    else if(info[3]==2){
      info[3]="At Distributer";
      setCurrentOwner(2);
    }
    else if(info[3]==3){
      info[3]="At Pharma";
      setCurrentOwner(3);
    }
    else if(info[3]==4){
      info[3]="Picked for Manufacturer";
    }
    else if(info[3]==5){
      info[3]="Picked for Wholesaler";
    }
    else if(info[3]==6){
      info[3]="Picked for Distributer";
    }
    else if(info[3]==7){
      info[3]="Picked for Pharma";
    }
    // const expiry=await medicine.methods.expiry().call();
    // setMedInfo({...info,expiry:expiry});
    setMedInfo(info);
    console.log(info);
    let owners=[];
    for (let owner in info[4]) {
      if(info[4][owner]!='0x0000000000000000000000000000000000000000'){
        let ownerInfo=await supplychain.methods.getUserInfo(info[4][owner]).call();
        if(ownerInfo.role==1){
          ownerInfo.role='Manufacturer';
        }
        else if(ownerInfo.role==2){
          ownerInfo.role='Wholesaler';
        }
        else if(ownerInfo.role==1){
          ownerInfo.role='Distributer';
        }
        else if(ownerInfo.role==1){
          ownerInfo.role='Pharma';
        }
        owners.push(ownerInfo);
      }
    }
    console.log(owners);
    setOwnersInfo(owners);
  },[])
  const links = [
  ];
  return (
    <div className="body">
      <div className="nav-box">
        <NavBar links={links} />
      </div>
      
      <div className="medicine">
        <div className="medicine-info">
          <div className="left-half">
            <h3 className="name">{medInfo[0]}</h3>
            <div className="row1">
              <div className="left">Name: </div>
              <div className="right">{medInfo[0]}</div>
            </div>
            <div className="row1">
              <div className="left">Quantity: </div>
              <div className="right">{medInfo[1]}</div>
            </div>
            <div className="row1">
              <div className="left">Status</div>
              <div className="right">{medInfo[3]}</div>
            </div>
            <div className="row1">
              <div className="left">Condition:</div>
              {medInfo[2]=='0'?<div className="right">Fresh</div>:<div className="right">Damaged</div>}
            </div>
            <div className="row1">
              <div className="left">Expiry</div>
              <div className="right">26-11-2024</div>
            </div>
            <div className="row1">
              <div className="left">Current Owner</div>
              {ownersInfo.length!=0?<div className="right">{ownersInfo[currentOwner][0]}</div>:<div className="right"></div>}
              
            </div>
          </div>
          <div className="right-half">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${batch}&amp;size=100x100`} alt="QR code" title="" />
            {/* <img src="/qr.jpg" alt="QR code" /> */}
          </div>
        </div>

        <div className="divider"></div>

        <div className="history">
          <div className="left">
            <section className="experience" id="experience">
              <div className="max-width1">
                <div className="experience-content">
                  {ownersInfo.map((owner)=>{
                    return <div className="outer" key={owner.ethAddress}>
                    <div className="card">
                      <div className="experience-details">
                        <div className="experience-level">
                          {owner.name}
                        </div>
                        <div className="date italic">{owner.role}</div>
                        <div className="company">{owner.ethAddress}</div>
                      </div>
                      <div className="square" />
                    </div>
                    <div className="circle">
                      <i className="fas fa-envelope" />
                    </div>
                  </div>
                  })}
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
