import { gql } from "@apollo/client";

export const GET_POSITIONS_BY_WALLET = gql`
  query GetPositionsByWallet($walletAddress: Bytes!) {
    positions(where: { wallet: $walletAddress }) {
      id
      wallet
      tokenIn {
        id
        name
        symbol
        decimals
        address
      }
      tokenOut {
        id
        name
        symbol
        decimals
        address
      }
      quantity
      executionValue
      endTimestamp
      fee
      condition
      forkABI
      blockNumber
      blockTimestamp
      transactionHash
      dexRouter {
        id
        isActive
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  }
`;
