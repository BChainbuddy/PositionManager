// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./DexControl.sol";

/**
 * @title FeeManager
 * @dev Manages the fee structure and distribution for the contract.
 * @dev Inherits DexControl for owner-only access control to fee management functions.
 */
contract FeeManager is DexControl {
    uint64 private s_dailyPositionFee;

    /**
     * @dev Sets the initial daily position fee and the contract owner.
     * @param dailyPositionFee The initial daily fee for positions.
     * @param initialOwner The address of the initial contract owner.
     */
    constructor(
        uint64 dailyPositionFee,
        address initialOwner
    ) DexControl(initialOwner) {
        s_dailyPositionFee = dailyPositionFee;
    }

    /**
     * @dev Returns the current daily position fee.
     * @return The current daily position fee in uint256.
     */
    function getDailyPositionFee() public view returns (uint256) {
        return s_dailyPositionFee;
    }

    /**
     * @dev Returns expected fee.
     * @return The expected gas fee in WEI.
     */
    function getExpectedFee(uint256 duration) public view returns (uint256) {
        return duration * getDailyPositionFee();
    }

    /**
     * @dev Changes the daily position fee.
     * @dev Can only be called by the contract owner.
     * @param newFee The new daily position fee to be set.
     */
    function changeFee(uint64 newFee) external onlyOwner {
        s_dailyPositionFee = newFee;
    }

    /**
     * @dev Distributes the fee amount to the contract owner.
     * @param amount The fee amount to be distributed.
     */
    function distributeFee(uint256 amount) internal {
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Fee transfer failed");
    }
}
