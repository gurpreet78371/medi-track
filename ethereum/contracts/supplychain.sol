// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./medicine.sol";
import "./order.sol";

contract SupplyChain {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    enum roles {
        norole,
        manufacturer,
        wholesaler,
        distributer,
        pharma,
        transporter
    }

    function registerUser(
        address EthAddress,
        string memory Name,
        string memory Location,
        uint256 Margin,
        uint256 Role
    ) public {
        require(msg.sender == owner);
        require(UsersDetails[EthAddress].role == roles.norole);
        UsersDetails[EthAddress].name = Name;
        UsersDetails[EthAddress].location = Location;
        UsersDetails[EthAddress].ethAddress = EthAddress;
        UsersDetails[EthAddress].margin = Margin;
        UsersDetails[EthAddress].role = roles(Role);
        users.push(EthAddress);
    }

    struct UserInfo {
        string name;
        string location;
        address ethAddress;
        uint256 margin;
        roles role;
    }

    mapping(address => UserInfo) UsersDetails;
    address[] users;

    function getUserInfo(address User)
        public
        view
        returns (
            string memory,
            string memory,
            address,
            uint256,
            roles
        )
    {
        return (
            UsersDetails[User].name,
            UsersDetails[User].location,
            UsersDetails[User].ethAddress,
            UsersDetails[User].margin,
            UsersDetails[User].role
        );
    }

    function getUsers() public view returns (address[] memory) {
        return users;
    }

    mapping(address => address[]) ManufacturedMedicine;

    function manufactureMedicine(
        string memory name,
        uint256 quantity,
        string memory expiry,
        uint256 price,
        string memory timestamp
    ) public {
        require(UsersDetails[msg.sender].role == roles.manufacturer);
        ManufacturedMedicine[msg.sender].push(
            address(new Medicine(msg.sender, name, quantity, expiry, price,timestamp))
        );
    }

    function getMedicinesMan(address _manufacturer)
        public
        view
        returns (address[] memory)
    {
        return (ManufacturedMedicine[_manufacturer]);
    }

    mapping(address => address[])[3] Medicines;

    function receiveMedicine(
        address batchId,
        uint256 receiverType,
        uint256 condition
    ) public {
        Medicine(batchId).receivePackage(msg.sender, receiverType, condition);
        Medicines[receiverType - 1][msg.sender].push(batchId);
    }

    function getMedicines(uint256 receiverType)
        public
        view
        returns (address[] memory)
    {
        return Medicines[receiverType - 1][msg.sender];
    }

    mapping(address => address[]) ordersPlaced;
    mapping(address => address[]) ordersReceived;

    function placeOrder(
        uint256 price,
        address _sender,
        address _receiver,
        address[] memory batches,
        string memory timestamp
    ) public payable {
        address order = address(new Order(price, _sender, _receiver,batches,timestamp));
        payable(order).transfer(msg.value);
        ordersPlaced[_receiver].push(order);
        ordersReceived[_sender].push(order);
    }

    function getOrdersPlaced() public view returns (address[] memory) {
        return ordersPlaced[msg.sender];
    }

    function getOredrsReceived() public view returns (address[] memory) {
        return ordersReceived[msg.sender];
    }
}
