import { gql } from "@apollo/client";

export const GET_POSITIONS_BY_WALLET = gql`
  query GetPositionsByWallet($walletAddress: Bytes!) {
    positions(where: { wallet: $walletAddress, status: "ACTIVE" }) {
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
      status
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

export const GET_POSITIONS_BY_ID = gql`
  query GetPositionsById($id: Bytes!) {
    positions(where: { id: $id }) {
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
      status
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

export const GET_TOKENS = gql`
  query GetTokensAll {
    tokens {
      id
      name
      symbol
      decimals
      address
    }
  }
`;
