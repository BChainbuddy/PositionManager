# Trade Forge Smart Contracts

**Trade Forge** is a decentralized trading platform that empowers users to create, manage, and execute custom trading positions on decentralized exchanges. The smart contract suite is the backbone of the platform—ensuring secure, transparent, and automated trading operations on‑chain.

## Overview

This folder contains the Solidity smart contracts for Trade Forge. The key components are:

- **DexChecker.sol:**  
  Provides utility functions and interfaces to interact with both Uniswap V2 and Uniswap V3 routers and factories. It checks for the existence of liquidity pools for a given token pair, returning information such as whether the pool exists and, for Uniswap V3, the applicable fee tier.

- **DexControl.sol:**  
  Extends DexChecker and integrates OpenZeppelin’s Ownable contract. It manages the whitelisting of DEX routers that the platform supports, ensuring only approved exchanges are used for trading.

- **FeeManager.sol:**  
  Manages the fee structure for the platform. This contract stores and allows the update of two key fees:
  - **Daily Position Fee:** A fee charged per day for maintaining a position.
  - **Execution Fee:** A fee applied during the execution of a trade.
  
  It also includes a function to distribute collected fees to the contract owner.

- **PositionManager.sol:**  
  The core contract that handles trading positions. It allows users to:
  - **Create Positions:** Initiate a trading position by specifying token pair, quantity, target execution price, duration, and an execution condition (whether to swap when the price is above or below the target).
  - **Withdraw Positions:** Cancel or remove a position if needed.
  - **Prolong Positions:** Extend the duration of an active position.
  - **Execute Swaps:** Automatically execute the trade if market conditions meet the user-defined criteria.
  
  This contract emits events (e.g., `PositionCreated`, `PositionExecuted`, etc.) that are later indexed by a subgraph for real‑time monitoring and analytics.

- **Token.sol:**  
  A basic ERC‑20 token contract used for testing and simulation. This contract mints a fixed supply to the deployer, allowing you to simulate token transfers and interactions with your trading contracts.

## Architecture & Workflow

1. **DEX Interaction and Validation:**  
   The `DexChecker` contract provides interfaces and functions to validate whether a liquidity pool exists on a given DEX for the token pair. This is critical for ensuring that positions are only created when a valid market exists.

2. **Access Control and Whitelisting:**  
   `DexControl` ensures that only whitelisted DEX routers are used by the platform. This prevents potential security risks by restricting interactions to approved exchanges.

3. **Fee Management:**  
   `FeeManager` stores and manages the fee parameters required to create and execute positions. It calculates the total expected fee for a position (combining daily and execution fees) and distributes collected fees to the owner.

4. **Position Management:**  
   The `PositionManager` contract is the primary contract that users interact with to manage their trading positions. It uses the functions provided by the underlying contracts to:
   - Validate inputs (token balances, allowances, etc.)
   - Calculate and collect fees
   - Handle token transfers and execute swaps automatically based on predefined conditions

5. **Event-Driven Architecture:**  
   Each significant action (e.g., position creation, execution, prolongation, withdrawal) emits an event. These events are designed to be indexed by off‑chain services (such as The Graph) to provide real‑time data and analytics for the platform's frontend.

## Deployment & Testing

- **Development Environment:**  
  The smart contracts are developed using Hardhat. Configuration files and scripts in this folder handle compilation, testing, and deployment.

- **Testing:**  
  The project includes a suite of tests (using Mocha/Chai and Hardhat) to ensure that all contract functions work as expected. This includes checking fee calculations, position creation logic, DEX whitelisting, and trade execution conditions.

## Conclusion

The Trade Forge smart contracts form a robust on‑chain foundation for a fully automated, decentralized trading platform. With clear separation of concerns—DEX validation, fee management, and position control—this architecture ensures security, scalability, and ease of integration with off‑chain data sources and front‑end applications.

This project serves as a comprehensive portfolio piece demonstrating advanced smart contract design, integration with decentralized data indexing, and automated trading logic.