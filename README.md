# Trade Forge

**Trade Forge** is a full‑stack decentralized trading platform that empowers users to create, manage, and automatically execute custom trading positions on decentralized exchanges. The platform leverages smart contracts, a dynamic Next.js frontend, a GraphQL subgraph for efficient data indexing, and a Node.js backend bot that continuously monitors market conditions to trigger trades automatically.

---

## What is Trade Forge?

Trade Forge provides a streamlined way for users to set up trading positions based on custom parameters (like token pairs, desired swap price, and duration). Users can enjoy the following benefits:

- **Customizable Trading Positions:**  
  Define trade parameters (such as token pair, quantity, and target price) to tailor your trading strategy.

- **Automated Trade Execution:**  
  Once the market meets your predefined conditions, Trade Forge automatically executes the trade on your behalf—saving time and ensuring optimal trade timing.

- **Real-Time Data & Monitoring:**  
  With integrated subgraph indexing, you get access to up‑to‑date market data and historical trade analytics for informed decision-making.

- **Seamless User Experience:**  
  A modern, responsive frontend that supports wallet connections (e.g., MetaMask, Coinbase) and presents data in an intuitive dashboard. - Phone responsivness in Progress

---

## Project Architecture

Trade Forge is composed of four main components

### 1. Smart Contracts (`/SmartContract`)
- **Overview:**  
  Contains Solidity smart contracts built with Hardhat. These contracts manage the core on‑chain logic for creating trading positions, executing trades, managing fees, and interacting with multiple decentralized exchanges (DEXes).
- **Key Features:**  
  - Creation and execution of trading positions  
  - Dex whitelist management
  - Dynamic fee management  
  - Integration with Uniswap V2 and V3 forks

### 2. Frontend (`/FrontEnd`)
- **Overview:**  
  A Next.js application that provides a user-friendly interface for traders. Users can create positions, monitor active trades, and interact with the blockchain seamlessly.
- **Key Features:**  
  - Responsive and modern UI  
  - Wallet connection support  
  - Interactive dashboards and charts for real‑time data

### 3. Subgraph (`/SubGraph`)
- **Overview:**  
  A subgraph built with The Graph Protocol indexes events emitted by the smart contracts. This allows for efficient querying of historical and real‑time data via GraphQL.
- **Key Features:**  
  - Indexing of position creation, execution, and updates  
  - Enriched data for tokens (e.g., name, symbol, decimals)  
  - Fast and scalable querying to power the frontend dashboard

### 4. BackEnd (`/BackEnd`)
- **Overview:**  
  A simple Node.js bot that runs continuously to monitor active positions. Using set intervals, it checks the market for trading conditions and automatically triggers trade execution when conditions are met.
- **Key Features:**  
  - Automated monitoring and execution of trades  
  - Ensures that user-defined trading strategies are executed promptly

---

## How Trade Forge Works

1. **Create a Trading Position:**  
   Users input the tokens, quantity, desired execution price, and duration. The smart contracts validate the inputs, collect fees, and emit events that are indexed by the subgraph.

2. **Indexing & Data Aggregation:**  
   The subgraph listens to events from the smart contracts and stores relevant data (including token metadata) for efficient querying. This allows the frontend to display real‑time position data and historical analytics.

3. **Automated Trade Execution:**  
   A Node.js backend bot continuously monitors the on‑chain state. When a trading position’s conditions are met (e.g., a target swap price is reached), the bot triggers the execution function on the smart contracts, completing the trade automatically.

4. **User Feedback & Analytics:**  
   The frontend provides live status updates, interactive charts, and detailed position analytics to help users track their performance and optimize their trading strategies.

---

## Project Subfolders

- **`/SmartContract`:**  
  Contains all the Solidity code, Hardhat configuration, and deployment scripts for the smart contracts that drive Trade Forge’s on‑chain logic.

- **`/FrontEnd`:**  
  Holds the Next.js application that users interact with. This includes components, pages, styles, and configurations for wallet connections and GraphQL queries.

- **`/SubGraph`:**  
  Contains the subgraph manifest, GraphQL schema, and mapping scripts that index blockchain events and store enriched data (such as token metadata) for querying.

- **`/BackEnd`:**  
  A Node.js-based backend bot that periodically checks the blockchain (or subgraph) for active positions and executes trades automatically based on predefined conditions.

---

## Value Proposition

Trade Forge streamlines the process of decentralized trading by combining automation with real‑time data and user-friendly interfaces. Whether you're a casual trader or a professional looking for automated trade execution, Trade Forge offers:

- **Enhanced Efficiency:**  
  Reduce manual trading overhead and execute positions automatically.

- **Cost Savings:**  
  Minimize gas fees by leveraging off‑chain indexing with the subgraph.

- **User Empowerment:**  
  Customize and monitor your trading strategy with ease, all while Trade Forge handles the heavy lifting on-chain.

---

## Conclusion

Trade Forge is a modular, scalable platform designed to revolutionize decentralized trading by merging smart contract automation, efficient data indexing, and a seamless user interface. This project not only demonstrates technical proficiency across multiple domains (blockchain, frontend, backend) but also provides a real‑world solution that empowers users to trade smarter.

Feel free to explore the individual modules for more detailed documentation on each component.