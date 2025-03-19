# Trade Forge

**Trade Forge** is a full‑stack decentralized trading platform that empowers users to create, manage, and automatically execute custom trading positions on decentralized exchanges. The platform leverages smart contract automation, a modern Next.js frontend, efficient GraphQL indexing via a subgraph, and a Node.js backend bot that continuously monitors market conditions to trigger trades automatically.

---

## What is Trade Forge?

Trade Forge streamlines the process of decentralized trading by allowing users to set up custom trading positions with parameters such as token pair, target execution price, and duration. Key benefits include:

- **Customizable Trading Positions:**  
  Tailor your trading strategy by selecting tokens, specifying quantities, and setting price targets and duration.

- **Automated Trade Execution:**  
  Once market conditions meet your predefined criteria, Trade Forge automatically executes the trade—saving you time and effort.

- **Real-Time Data & Monitoring:**  
  With on‑chain data indexed via our subgraph, you gain fast access to both historical and live market data for informed decision‑making.

- **Seamless User Experience:**  
  A responsive frontend with wallet integration (e.g., MetaMask, Coinbase) ensures that managing your trading positions is intuitive and straightforward.

---

## Project Architecture

Trade Forge is comprised of four main components:

### 1. Smart Contracts (`/SmartContract`)
- **Overview:**  
  Contains Solidity smart contracts built using Hardhat. These contracts manage core on‑chain logic for creating and executing trading positions, managing fees, and interacting with multiple decentralized exchanges (DEXes).
- **Key Features:**  
  - Creation and execution of trading positions  
  - DEX whitelist management  
  - Dynamic fee management  
  - Integration with Uniswap V2 and V3 forks

### 2. Frontend (`/FrontEnd`)
- **Overview:**  
  A Next.js application that provides an engaging and user-friendly interface for traders. It includes a landing page, an application area for dashboard, trade forging, and detailed position views.
- **Key Features:**  
  - A landing page that explains the product  
  - `/app/dashboard`: A dashboard displaying top coins, market cap (via CoinGecko API), and user’s top positions  
  - `/app/forge`: A three-step process for creating trading positions (token selection, parameter input, and forging the trade)  
  - `/app/positions`: A list view of all user positions fetched from the GraphQL subgraph  
  - `/app/positions/[walletAddress]/[positionId]`: Detailed view for individual positions, including an embedded TradingView chart (if available)

### 3. Subgraph (`/SubGraph`)
- **Overview:**  
  A subgraph built with The Graph Protocol that indexes events from the Trade Forge smart contracts. It aggregates on‑chain data, including token metadata (name, symbol, decimals), automatically building a token list of all traded tokens.
- **Key Features:**  
  - Efficiently indexes position events (creation, execution, prolongation, withdrawal)  
  - Automatically stores token metadata so no external token list is required  
  - Provides a fast GraphQL interface for the frontend and backend

### 4. BackEnd (`/BackEnd`)
- **Overview:**  
  A minimalistic Node.js bot that monitors active positions and automatically executes trades when the conditions are met. It demonstrates the core idea of automated trade execution and can be extended for scalability and advanced strategies.
- **Key Features:**  
  - Periodically polls active positions from the blockchain  
  - Fetches live price data from Uniswap V2/V3 pools  
  - Automatically calls smart contract functions to execute trades  
  - Designed for further expansion to a production‑grade system

---

## Navigation to Module READMEs

For more detailed documentation on each part of the project, please refer to the following module READMEs:

- [Smart Contracts README](/SmartContract/README.md)  
  _Detailed documentation for smart contracts, including deployment, testing, and architecture._

- [Frontend README](/FrontEnd/my-app/README.md)  
  _Documentation for the Next.js frontend, including setup, structure, and component guides._

- [Subgraph README](/Subgraph/README.md)
  _Overview of the subgraph, its schema, mapping, and data indexing process using The Graph Protocol._

- [BackEnd README](/BackEnd/README.md)  
  _Explanation of the backend bot’s architecture, automated trade execution, and future scalability plans._

---

## Value Proposition

Trade Forge revolutionizes decentralized trading by combining:

- **Automation:**  
  Automatically executes trades when market conditions meet user-defined criteria, reducing manual intervention.

- **Efficiency:**  
  Offloads data indexing to a subgraph, resulting in fast, scalable queries and minimized on‑chain gas usage.

- **Transparency:**  
  Provides real‑time and historical trading data through an intuitive dashboard and comprehensive GraphQL queries.

- **User Empowerment:**  
  Offers customizable trading strategies with minimal setup, enabling traders to focus on strategy while the platform handles execution.

---

## Conclusion

Trade Forge is a modular, scalable platform that demonstrates advanced smart contract design, real‑time data indexing, and a seamless user interface for decentralized trading. Whether you are a casual trader or a professional, Trade Forge empowers you to trade smarter, with the heavy lifting handled on‑chain and off‑chain.

Explore the module READMEs for in‑depth technical details, and see how Trade Forge integrates blockchain technology with modern web development to deliver a comprehensive trading solution.

