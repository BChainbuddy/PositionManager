// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./DexControl.sol";

contract FeeManager is DexControl {
    uint64 private s_dailyPositionFee;

    constructor(
        uint64 dailyPositionFee,
        address initialOwner
    ) DexControl(initialOwner) {
        s_dailyPositionFee = dailyPositionFee;
    }

    function getDailyPositionFee() public view returns (uint256) {
        return s_dailyPositionFee;
    }

    function changeFee(uint64 newFee) external onlyOwner {
        s_dailyPositionFee = newFee;
    }

    function distributeFee(uint64 amount) internal {
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Fee transfer failed");
    }
}
