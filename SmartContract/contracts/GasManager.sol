// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GasManager is ReentrancyGuard {
    mapping(address => uint256) public userGas;

    function provideGas() external payable {
        userGas[msg.sender] += msg.value;
    }

    function withdrawGas(uint256 gasAmount) external nonReentrant {
        require(userGas[msg.sender] >= gasAmount, "Insufficient gas balance");
        userGas[msg.sender] -= gasAmount;

        (bool success, ) = payable(msg.sender).call{value: gasAmount}("");
        require(success, "Failed to withdraw gas");
    }
}
