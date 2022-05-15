import React, { useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useRouter } from "next/router";
import { useState } from "react";
import Medicine from "../../ethereum/medicine";
import Order from "../../ethereum/order";
import supplychain from "../../ethereum/supplychain";

export default function medicine_info() {
    const [orderInfo, setOrderInfo] = useState({receiver:{0:""},sender:{0:""},batchDetails:[]});
    const router = useRouter();
    const orderAddress = router.query.orderAddress;
    
    useEffect(async () => {
        const order = Order(orderAddress);
        let info = await order.methods.getInfo().call();
        info.address = orderAddress;
        let recDate=new Date(Date.parse(info[7]));
        // console.log(recDate);
        // console.log(typeof(recDate));
        // recDate=`${recDate.getDate()}/${recDate.getMonth()}/${recDate.getFullYear()} ${recDate.getHours()}:${recDate.getMinutes()}`;
        recDate=recDate.toLocaleString();
        info[7]=recDate;
        info.batchDetails = [];
        for (let ind in info[1]) {
          let batchInfo = await Medicine(info[1][ind]).methods.getInfo().call();
          let manInfo=await supplychain.methods.getUserInfo(batchInfo[3][0]).call();
          batchInfo.manufacturer=manInfo;
          batchInfo.address = info[1][ind];
          info.batchDetails.push(batchInfo);
        }
        let receiver = await supplychain.methods.getUserInfo(info[3]).call();
        info.receiver = receiver;

        let sender=await supplychain.methods.getUserInfo(info[2]).call();
        info.sender=sender;

        if (info[5] == 0) {
            info[5] = "At Sender";
        } else if (info[5] == 1) {
            info[2] = "With Shipper";
        } else if (info[2] == 2) {
            info[2] = "Delivered";
        }
        console.log(info);
        setOrderInfo(info);
    }, []);
    const links = [];
    return (
        <div className="body">
            <div className="nav-box">
                <NavBar links={links} />
            </div>

            <div className="medicine">
                <div className="medicine-info">
                    <div className="left-half">
                        <h3 className="name">{orderInfo.receiver[0]}</h3>
                        <div className="row1">
                            <div className="left">Order by: </div>
                            <div className="right">{orderInfo.receiver[0]}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Sender: </div>
                            <div className="right">{orderInfo.sender[0]}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Status:</div>
                            <div className="right">{orderInfo[5]}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Price (in eth):</div>
                            <div className="right">{orderInfo[0]/1000000000000} Eth</div>
                        </div>
                        <div className="row1">
                            <div className="left">Ordered on:</div>
                            <div className="right">{orderInfo[7]}</div>
                        </div>
                        <div className="row1">
                            <div className="left">Order Address:</div>
                            <div className="right">{orderAddress}</div>
                        </div>
                    </div>
                    <div className="right-half">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?data=${orderAddress}&amp;size=100x100`}
                            alt="QR code"
                            title=""
                        />
                        {/* <img src="/qr.jpg" alt="QR code" /> */}
                    </div>
                </div>

                <div className="divider"></div>

                <div>
                    <div><h3>Batches:</h3></div>
                    {orderInfo.batchDetails.map(batch=>{
                        return (
                            <div className="my-3 bg-white shadow-md py-3 px-4 rounded-md"
                            key={batch.address}>
                                <div className="flex justify-between">
                                    <h2>{batch[0]}</h2>
                                    <p className="m-0">{batch[6]/1000000000000} Eth</p>
                                </div>
                                <p className="m-0">Manufacturer: {batch.manufacturer[0]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
