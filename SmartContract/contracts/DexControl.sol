// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DexControl is Ownable {
    event DexRouterWhitelisted(address dexRouter);

    mapping(address => bool) private whitelistedDexes;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function whitelistDexRouter(address dexRouter) public onlyOwner {
        whitelistedDexes[dexRouter] = true;
        emit DexRouterWhitelisted(dexRouter);
    }

    function isWhitelistedDex(address dexRouter) public view returns (bool) {
        return whitelistedDexes[dexRouter];
    }
}
