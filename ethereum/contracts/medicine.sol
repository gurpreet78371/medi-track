// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

contract Medicine{
    enum medicineStatus{
        atManufacturer,
        atWholesaler,
        atDistributer,
        atPharma,
        pickedForM,
        pickedForW,
        pickedForD,
        pickedForP
    }

    string name;
    uint256 quantity;
    address[4] owners;
    address shipper;
    medicineStatus status;
    medicineCondition condition;
    address currentOwner;
    string expiry;

    enum medicineCondition{
        fresh,
        damaged
    }

    constructor(
        address _manufacturer,
        string memory _name,
        uint256 _quantity,
        address _shipper,
        address _receiver,
        string memory _expiry
    ){
        owners[0]=_manufacturer;
        currentOwner=_manufacturer;
        name=_name;
        quantity=_quantity;
        shipper=_shipper;
        owners[1]=_receiver;
        expiry=_expiry;
        status=medicineStatus(0);
        condition=medicineCondition(0);
    }

    function getInfo() public view returns(string memory,uint256,uint256,uint256,address[4] memory){
        return (name,quantity,uint256(condition),uint256(status),owners);
    }

    function pickPackage(address _shipper,uint256 senderType) public{
        require(shipper==_shipper);
        require(status==medicineStatus(senderType));
        status=medicineStatus(senderType+5);
    }

    function receivePackage(address _receiver,uint256 receiverType,uint256 _condition) public {
        require(owners[receiverType]==_receiver);
        require(status==medicineStatus(receiverType+4));

        if(condition==medicineCondition(0) && _condition==1){
            status=medicineStatus(uint256(status)-1);
            condition=medicineCondition(1);
        }
        else{
            status=medicineStatus(receiverType);
            currentOwner=_receiver;
            shipper=address(0x0);
        }
    }

    function sendPackage(address _sender,address _shipper,address _receiver,uint256 senderType) public {
        require(currentOwner==_sender);
        require(senderType==1 || senderType==2);
        shipper=_shipper;
        owners[senderType+1]=_receiver;
    }
}