# Trade Forge FrontEnd

The Trade Forge FrontEnd is a Next.js application that provides a complete user interface for interacting with the Trade Forge decentralized trading platform. This application enables users to create trading positions, view live market data, monitor active positions, and explore detailed analytics—all while leveraging blockchain data indexed via GraphQL.

---

## Overview

The frontend is structured to provide both an introductory landing page and a full-featured application with multiple routes. Key features include:

- **Landing Page (`/`):**  
  Introduces the Trade Forge product, explains its benefits, and highlights the platform's value proposition.

- **Dashboard (`/app/dashboard`):**  
  A simplistic dashboard that displays top coins, market capitalization (fetched from the CoinGecko API), and the user’s top positions. This page offers an at-a-glance view of the current market and active trading positions.

- **Forge (`/app/forge`):**  
  The core trade creation flow where users follow three steps:
  1. **Token Selection:** Choose tokens to trade.  
  2. **Parameter Input:** Input the trade amount, duration, and select the DEX (or use automatic DEX find).  
  3. **Forge Trade:** Finalize the position and initiate the trade.

- **Positions List (`/app/positions`):**  
  Displays all trading positions retrieved from our GraphQL endpoint. Users can view an overview of their positions and see details such as trading parameters, current status, and historical performance.

- **Position Details (`/app/positions/[walletAddress]/[positionId]`):**  
  A detailed view for a specific trading position. This page shows comprehensive stats for the position, including an embedded TradingView chart (if available), price data, and other relevant metrics—all fetched from our subgraph.

---

## Architecture & Data Flow

### Data Aggregation via GraphQL
- **On‑Chain Data Indexed Off‑Chain:**  
  To keep the smart contracts gas‑efficient, all key trading events and token metadata are indexed by our subgraph. This includes:
  - Trading positions (creation, execution, prolongation, withdrawal)
  - Token metadata (name, symbol, decimals)
  - DEX router whitelisting events

- **Token List Management:**  
  Instead of storing a static token list on-chain, the subgraph automatically builds a token list by capturing each token involved in a trade. When a user creates a position with a new token:
  - The system fetches the token’s symbol, name, and decimals from the token contract.
  - The token is then added to the subgraph’s token list.
  
  This approach not only reduces on-chain storage costs but also ensures that the token list remains up‑to‑date.

- **Token Images:**  
  Token images are sourced from external providers such as CoinGecko. The frontend maps token addresses to image URLs stored in our database, ensuring that users see the appropriate icon for each token.

### User Workflow & Challenges

- **User Interaction:**  
  Users begin by exploring the landing page, then navigate to the dashboard to get an overview of market conditions and their active positions. The forge section guides users through the process of creating a new trading position, while the positions section provides detailed historical data.

- **Key Challenge – Token Metadata:**  
  One of the challenges during the build was determining how to obtain token metadata without incurring high gas costs. To solve this:
  - I've designed the subgraph to automatically index token details when a position is created.
  - If a token is not found in the existing token list, the user can input its address, and the system fetches the token's symbol, name, and decimals from the token contract.  
  - This ensures that the platform always has a complete and accurate token list without having to rely on external sources.

- **Overall Benefits:**  
  This architecture separates on‑chain functionality (smart contracts) from off‑chain data aggregation (subgraph), enabling a responsive and efficient user experience while minimizing gas costs and maintenance overhead.

---

## Conclusion

The Trade Forge FrontEnd provides a clean, user‑friendly interface that seamlessly interacts with our blockchain backend and subgraph. By leveraging real‑time data from GraphQL, the application delivers rich analytics and a dynamic trading experience. This design not only demonstrates advanced web3 integration but also highlights innovative solutions for token metadata management and decentralized data indexing.