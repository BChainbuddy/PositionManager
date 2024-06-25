// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DexControl
 * @dev Manages the whitelisting of decentralized exchange (DEX) routers.
 * @dev Inherits Ownable to restrict certain functions to the contract owner.
 */
contract DexControl is Ownable {
    // Event emitted when a DEX router is whitelisted
    event DexRouterWhitelisted(address dexRouter);

    // Mapping to store whitelisted DEX routers
    mapping(address => bool) private whitelistedDexes;

    /**
     * @dev Sets the initial owner of the contract.
     * @param initialOwner The address of the initial contract owner.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Whitelists a DEX router. Can only be called by the contract owner.
     * @dev Emits a DexRouterWhitelisted event.
     * @param dexRouter The address of the DEX router to whitelist.
     */
    function whitelistDexRouter(address dexRouter) public onlyOwner {
        whitelistedDexes[dexRouter] = true;
        emit DexRouterWhitelisted(dexRouter);
    }

    /**
     * @dev Checks if a DEX router is whitelisted.
     * @param dexRouter The address of the DEX router to check.
     * @return True if the DEX router is whitelisted, false otherwise.
     */
    function isWhitelistedDex(address dexRouter) public view returns (bool) {
        return whitelistedDexes[dexRouter];
    }
}
