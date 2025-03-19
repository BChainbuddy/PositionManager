# Trade Forge BackEnd

The **Trade Forge BackEnd** is a lightweight Node.js bot designed to automate the execution of trading positions on the blockchain. Serving as a critical component of the Trade Forge ecosystem, this bot continuously monitors live trading positions and automatically executes swaps when market conditions meet predefined targets. This minimalistic implementation demonstrates advanced on‑chain monitoring and automated trade execution, and it lays the foundation for future scalability and feature enhancements.

---

## Overview

The BackEnd bot is responsible for:

- **Monitoring Active Positions:**  
  Periodically scans the Trade Forge smart contracts to identify active trading positions that have not yet been executed.

- **Price Checking:**  
  Fetches real‑time pricing data from Uniswap V2/V3 liquidity pools via helper functions (`getV2Price` and `getV3Price`) to determine if a position’s target price has been reached.

- **Automated Trade Execution:**  
  When the market price meets the predefined condition, the bot triggers the `executeSwap` function on the PositionManager contract to automatically complete the trade.

- **Minimalistic Design with Future Scalability:**  
  The current implementation is intentionally minimalistic. It demonstrates the core logic of monitoring and execution while leaving room for future improvements—such as enhanced error handling, more robust scheduling, and integration with off‑chain price oracles.

---

## Architecture & Workflow

1. **Blockchain Connection:**  
   The bot connects to the blockchain using an `ethers.JsonRpcProvider` and creates a signer from a wallet private key. This allows secure interaction with the Trade Forge PositionManager contract.

2. **Position Monitoring:**  
   - The bot retrieves the latest position ID from the PositionManager contract.
   - For each active (unexecuted) position, it sets up a listener that polls the current market price every few seconds.

3. **Price Checking:**  
   - Depending on whether the position is on Uniswap V2 or V3, the bot calls helper functions (`getV2Price` or `getV3Price`) to obtain the current price.
   - These functions use on‑chain data (such as pool reserves or slot0 values) to compute the current market price.

4. **Automated Execution:**  
   - If the current price meets the user-defined execution condition, the bot invokes the `executeSwap` function on the smart contract.
   - The trade is executed automatically, and the position is updated accordingly.

5. **Future Enhancements:**  
   The current bot is minimalistic. Future versions may include:
   - Enhanced logging and error handling for production-grade monitoring.
   - Scalable job scheduling using task queues (e.g., Bull or Agenda).
   - Integration with external price oracles and improved market data sources.
   - More sophisticated trade execution strategies and risk management.

---

## Key Contributions & Value

- **Automation:**  
  Automates trade execution based on real‑time market data, reducing manual intervention and ensuring trades are executed promptly.

- **Efficient Monitoring:**  
  Uses a simple polling mechanism to efficiently track active positions and execute trades when conditions are met.

- **Modular and Scalable:**  
  Designed as a minimalistic prototype that can be extended or integrated with other components of the Trade Forge ecosystem as the platform grows.

- **Portfolio Impact:**  
  Demonstrates advanced blockchain integration, real‑time data processing, and automated smart contract interaction—all of which are critical in a modern decentralized trading platform.

---

## Conclusion

The Trade Forge BackEnd is a testament to the potential of automation in decentralized finance. By continuously monitoring trading positions and executing trades automatically when market conditions are favorable, this bot not only simplifies the trading process but also provides a robust foundation for future development. As a portfolio project, it showcases practical blockchain automation techniques and a scalable architecture that can evolve with the platform.

---

*This project is a work in progress. The current implementation is minimalistic, and future iterations will focus on enhanced scalability, improved error handling, and deeper integration with external data sources for a more robust trading automation solution.*
