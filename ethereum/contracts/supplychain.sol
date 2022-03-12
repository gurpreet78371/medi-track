// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./medicine.sol";

contract SupplyChain{
    address public owner;

    constructor(){
        owner=msg.sender;
    }

    enum roles {
        norole,
        manufacturer,
        wholesaler,
        distributer,
        pharma,
        transporter
    }

    function registerUser(address EthAddress,string memory Name,string memory Location,uint256 Role) public{
        require(msg.sender == owner);
        require(UsersDetails[EthAddress].role == roles.norole);
        UsersDetails[EthAddress].name = Name;
        UsersDetails[EthAddress].location = Location;
        UsersDetails[EthAddress].ethAddress = EthAddress;
        UsersDetails[EthAddress].role = roles(Role);
        users.push(EthAddress);
    }

    struct UserInfo{
        string name;
        string location;
        address ethAddress;
        roles role;
    }

    mapping(address => UserInfo) UsersDetails;
    address[] users;

    function getUserInfo(address User)
        public
        view
        returns (string memory name,string memory location,address ethAddress,roles role)
    {
        return (UsersDetails[User].name,UsersDetails[User].location,UsersDetails[User].ethAddress,UsersDetails[User].role);
    }

    function getUsers() public view returns(address[] memory){
        return users;
    }

    mapping(address => address[]) ManufacturedMedicine;

    function manufactureMedicine(string memory name,uint256 quantity,address shipper,address receiver,string memory expiry) public {
        require(UsersDetails[msg.sender].role==roles.manufacturer);
        ManufacturedMedicine[msg.sender].push(address(new Medicine(msg.sender,name,quantity,shipper,receiver,expiry)));
    }

    function getMedicinesMan(address _manufacturer) public view returns(address[] memory){
        return(ManufacturedMedicine[_manufacturer]);
    }

    mapping(address => address[])[3] Medicines;

    function receiveMedicine(address batchId,uint256 receiverType,uint256 condition) public{
        Medicine(batchId).receivePackage(msg.sender, receiverType, condition);
        Medicines[receiverType-1][msg.sender].push(batchId);
    }

    function getMedicines(uint256 receiverType) public view returns(address[] memory){
        return Medicines[receiverType-1][msg.sender];
    }
}