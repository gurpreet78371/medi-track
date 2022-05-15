// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./medicine.sol";

contract Order {
    enum orderStatus {
        withSender,
        withShipper,
        withReceiver
    }

    enum orderCondition {
        good,
        damaged
    }

    uint256 price;
    address[] batches;
    address payable sender;
    address receiver;
    address payable shipper;
    orderStatus status;
    orderCondition condition;
    string orderPlacementTime;
    string orderReceivementTime;

    constructor(
        uint256 _price,
        address _sender,
        address _receiver,
        address[] memory _batches,
        string memory timestamp
    ) {
        price = _price;
        sender = payable(_sender);
        receiver = _receiver;
        batches = _batches;
        orderPlacementTime = timestamp;
        status = orderStatus(0);
        condition = orderCondition.good;
    }

    receive() external payable {}

    function addInfo(address _shipper, uint256 senderType) public {
        require(status == orderStatus.withSender);
        require(sender == msg.sender);
        shipper = payable(_shipper);
        for (uint256 i = 0; i < batches.length; i++) {
            Medicine(batches[i]).sendPackage(
                sender,
                _shipper,
                receiver,
                senderType
            );
        }
    }

    function getInfo()
        public
        view
        returns (
            uint256,
            address[] memory,
            address,
            address,
            address,
            uint256,
            uint256,
            string memory,
            string memory
        )
    {
        return (
            price,
            batches,
            sender,
            receiver,
            shipper,
            uint256(status),
            uint256(condition),
            orderPlacementTime,
            orderReceivementTime
        );
    }

    function pickOrder(address _shipper, uint256 senderType) public {
        require(shipper == _shipper);
        require(status == orderStatus(0));
        status = orderStatus.withShipper;
        for (uint256 i = 0; i < batches.length; i++) {
            Medicine(batches[i]).pickPackage(_shipper, senderType);
        }
    }

    function receiveOrder(
        address _receiver,
        uint256 _condition,
        uint256 receiverType,
        string memory timestamp
    ) public {
        require(receiver == _receiver);
        require(status == orderStatus.withShipper);

        if (condition == orderCondition.good && (_condition == 1)) {
            condition = orderCondition(_condition);
        } else {
            status = orderStatus.withReceiver;
            orderReceivementTime=timestamp;
            for (uint256 i = 0; i < batches.length; i++) {
                Medicine(batches[i]).receivePackage(
                    _receiver,
                    receiverType,
                    _condition
                );
            }
            sender.transfer(address(this).balance);
        }
    }
}
