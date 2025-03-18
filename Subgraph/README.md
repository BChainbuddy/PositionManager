# Trade Forge Subgraph

The Trade Forge Subgraph is built using The Graph Protocol and serves as the on‑chain indexing layer for the Trade Forge platform. It automatically captures events from the Trade Forge smart contracts and creates a comprehensive, queryable dataset—including a complete token list of all traded tokens—eliminating the need for an external token list.

---

## Overview

The subgraph indexes key events emitted by the Trade Forge smart contracts. This data is then available via GraphQL queries, powering our frontend dashboards and backend analytics.

### Key Entities

- **WhitelistedDexRouter:**  
  Represents DEX routers that have been approved (whitelisted) by the platform. This entity stores the router's address, its active status, and metadata about when it was whitelisted or removed.

- **Position:**  
  Stores details about a trading position, including:
  - The creator’s wallet address.
  - The token pair (input and output tokens) with automatically indexed metadata (name, symbol, decimals).
  - Trading parameters such as quantity, execution price, and duration.
  - Execution conditions (whether to swap when the price is above or below the target).
  - A reference to the whitelisted DEX router used.

- **PositionExecuted, PositionProlonged, and PositionWithdrawn:**  
  These entities capture events that update the status of positions. They record details such as the block number, timestamp, and transaction hash, enabling the system to track each position’s lifecycle.

- **Token:**  
  Automatically populated using the `fetchOrCreateToken` helper function. For every token involved in a trading position, the subgraph retrieves metadata (name, symbol, decimals) directly from the token’s ERC-20 interface. This process builds a token list of all traded tokens without relying on an external source.

---

## Architecture & Workflow

1. **Event Indexing:**
   - When users interact with Trade Forge (e.g., create a position, execute a trade, prolong or withdraw a position), the smart contracts emit events.
   - The subgraph listens for these events and processes them using mapping functions defined in `src/position-manager.ts`.

2. **Automatic Token Metadata Fetching:**
   - The `fetchOrCreateToken` function is invoked during event handling to fetch ERC-20 token details (name, symbol, decimals) from the token contract.
   - This data is stored in the `Token` entity, automatically building a comprehensive token list for all tokens traded on the platform.

3. **Data Relationships & Derived Fields:**
   - The schema establishes relationships between entities using `@derivedFrom`. For example, each `Position` is linked to its corresponding tokens (`tokenIn` and `tokenOut`) and the whitelisted DEX router.
   - Derived fields allow for easy querying of related data (e.g., all positions for a particular token).

4. **GraphQL Querying:**
   - Once deployed, the subgraph exposes a GraphQL endpoint that the frontend and backend can query.
   - This endpoint provides efficient access to historical and real‑time data, including active positions, token details, and transaction history.

---

## Benefits

- **Automatic Token List Creation:**  
  All tokens that interact with the Trade Forge smart contracts are automatically indexed. There is no need to import or maintain an external token list.

- **Efficient Data Retrieval:**  
  The subgraph allows fast and scalable queries of on‑chain data, enabling a responsive frontend and reducing the load on the smart contracts.

- **Comprehensive Data Model:**  
  By capturing all key events (position creation, execution, prolongation, and withdrawal) along with token metadata, the subgraph provides a complete picture of the platform's on‑chain activity.

---

## How It Works

1. **Deployment:**
   - The subgraph is configured via the `subgraph.yaml` file, which specifies the data sources (smart contract addresses and ABIs) and event handlers.
   - The Graph CLI is used to deploy the subgraph to The Graph’s hosted service or Graph Network.

2. **Mapping Handlers:**
   - Each event emitted by the Trade Forge contracts (e.g., `PositionCreated`, `PositionExecuted`) is handled in `src/position-manager.ts`.
   - These handlers transform raw blockchain data into entities that are stored in the Graph Node.
   - Helper functions convert Solidity enum values to human-readable strings, ensuring clarity in the data model.

3. **Querying the Data:**
   - With the subgraph deployed, you can query the GraphQL endpoint to retrieve detailed information about trading positions, whitelisted DEX routers, and tokens.
   - This data drives the Trade Forge frontend, providing real‑time insights and historical analytics.

---

## Conclusion

The Trade Forge Subgraph is a critical component of our platform, providing a scalable, efficient, and automated method for indexing on‑chain data. By automatically building a token list and indexing all trading events, the subgraph ensures that our users and developers have fast, reliable access to all relevant data without the need for external token lists.