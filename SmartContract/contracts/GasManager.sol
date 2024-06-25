// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GasManager
 * @notice This contract allows users to provide and withdraw gas in the form of Ether.
 * @dev Inherits from ReentrancyGuard to prevent reentrant calls.
 */
contract GasManager is ReentrancyGuard {
    // Mapping to track the amount of gas (Ether) provided by each user
    mapping(address => uint256) public userGas;

    /**
     * @notice Allows a user to provide gas (Ether) to the contract.
     * @dev The provided gas is added to the user's balance.
     */
    function provideGas() external payable {
        userGas[msg.sender] += msg.value;
    }

    /**
     * @notice Allows a user to withdraw a specified amount of gas (Ether) from the contract.
     * @param gasAmount The amount of gas (Ether) to withdraw.
     * @dev Uses the nonReentrant modifier to prevent reentrant calls.
     */
    function withdrawGas(uint256 gasAmount) external nonReentrant {
        require(userGas[msg.sender] >= gasAmount, "Insufficient gas balance");
        userGas[msg.sender] -= gasAmount;

        (bool success, ) = payable(msg.sender).call{value: gasAmount}("");
        require(success, "Failed to withdraw gas");
    }
}
