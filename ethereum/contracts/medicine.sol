// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

contract Medicine {
    enum medicineStatus {
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
    address currentOwner;
    string expiry;
    uint256 price;
    string timestamp;

    constructor(
        address _manufacturer,
        string memory _name,
        uint256 _quantity,
        string memory _expiry,
        uint256 _price,
        string memory _timestamp
    ) {
        owners[0] = _manufacturer;
        currentOwner = _manufacturer;
        name = _name;
        quantity = _quantity;
        expiry = _expiry;
        price = _price;
        timestamp = _timestamp;
        status = medicineStatus(0);
    }

    function getInfo()
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            address[4] memory,
            string memory,
            address,
            uint256,
            string memory
        )
    {
        return (
            name,
            quantity,
            uint256(status),
            owners,
            expiry,
            currentOwner,
            price,
            timestamp
        );
    }

    function pickPackage(address _shipper, uint256 senderType) public {
        require(shipper == _shipper);
        require(status == medicineStatus(senderType));
        status = medicineStatus(senderType + 5);
    }

    function receivePackage(
        address _receiver,
        uint256 receiverType,
        uint256 _condition
    ) public {
        require(owners[receiverType] == _receiver);
        require(status == medicineStatus(receiverType + 4));

        if (_condition == 1) {
            status = medicineStatus(uint256(status) - 1);
        } else {
            status = medicineStatus(receiverType);
            currentOwner = _receiver;
            shipper = address(0x0);
        }
    }

    function sendPackage(
        address _sender,
        address _shipper,
        address _receiver,
        uint256 senderType
    ) public {
        require(currentOwner == _sender);
        shipper = _shipper;
        owners[senderType + 1] = _receiver;
    }
}
