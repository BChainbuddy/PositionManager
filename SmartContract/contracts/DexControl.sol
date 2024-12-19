// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DexChecker.sol";

/**
 * @title DexControl
 * @dev Manages the whitelisting of decentralized exchange (DEX) routers.
 * @dev Inherits Ownable to restrict certain functions to the contract owner.
 */
contract DexControl is Ownable, DexChecker {
    // Event emitted when a DEX router is whitelisted
    event DexRouterWhitelisted(address dexRouter);

    // Event emitted when a DEX router has been removed from whitelist
    event DexRouterRemoved(address dexRouter);

    // Mapping to store whitelisted DEX routers
    mapping(address => DexRouter) public whitelistedDexes;

    // Struct of DexRouter info
    struct DexRouter {
        bool isWhitelisted;
        UniswapABI dexType;
    }

    /**
     * @dev Sets the initial owner of the contract.
     * @param initialOwner The address of the initial contract owner.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Whitelists a DEX router. Can only be called by the contract owner.
     * @dev Emits a DexRouterWhitelisted event.
     * @param dexRouter The address of the DEX router to whitelist.
     * @param dexABI The abi type of the dex router V2 or V3
     */
    function whitelistDexRouter(
        address dexRouter,
        UniswapABI dexABI
    ) public onlyOwner {
        require(
            !whitelistedDexes[dexRouter].isWhitelisted,
            "Dex router is already whitelisted"
        );
        whitelistedDexes[dexRouter] = DexRouter(true, dexABI);
        emit DexRouterWhitelisted(dexRouter);
    }

    /**
     * @dev Removes a DEX router from whitelist. Can only be called by the contract owner.
     * @dev Emits DexRouterRemoved event.
     * @param dexRouter The address of the DEX router to be removed.
     */
    function removeDexRouter(address dexRouter) public onlyOwner {
        require(
            whitelistedDexes[dexRouter].isWhitelisted,
            "The dex is not on the whitelist"
        );
        whitelistedDexes[dexRouter].isWhitelisted = false;
        emit DexRouterRemoved(dexRouter);
    }
}
