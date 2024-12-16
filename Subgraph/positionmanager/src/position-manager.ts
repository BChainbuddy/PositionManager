import {
  DexRouterWhitelisted as DexRouterWhitelistedEvent,
  PositionCreated as PositionCreatedEvent,
  PositionExecuted as PositionExecutedEvent,
  PositionProlonged as PositionProlongedEvent,
  PositionWithdrawn as PositionWithdrawnEvent,
} from "../generated/PositionManager/PositionManager";
import {
  DexRouterWhitelisted,
  PositionCreated,
  PositionExecuted,
  PositionProlonged,
  PositionWithdrawn,
  Token,
} from "../generated/schema";

import { ERC20 } from "../generated/PositionManager/ERC20"; // Import ERC20 binding
import { Address, BigInt, log } from "@graphprotocol/graph-ts"; // Import necessary types

/**
 * Helper function to map ExecutionCondition enum from Solidity to GraphQL string.
 */
function getExecutionCondition(condition: i32): string {
  switch (condition) {
    case 0:
      return "Above";
    case 1:
      return "Below";
    default:
      return "Unknown"; // Handle unexpected values
  }
}

/**
 * Helper function to map UniswapABI enum from Solidity to GraphQL string.
 */
function getUniswapABI(forkABI: i32): string {
  switch (forkABI) {
    case 0:
      return "V2";
    case 1:
      return "V3";
    default:
      return "Unknown"; // Handle unexpected values
  }
}

export function handleDexRouterWhitelisted(
  event: DexRouterWhitelistedEvent
): void {
  let entity = new DexRouterWhitelisted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.dexRouter = event.params.dexRouter;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePositionCreated(event: PositionCreatedEvent): void {
  let entity = new PositionCreated(event.params.positionId.toString());

  entity.wallet = event.params.wallet;
  entity.dexRouter = event.params.dexRouter;
  entity.tokenIn = fetchOrCreateToken(event.params.tokenIn).id;
  entity.tokenOut = fetchOrCreateToken(event.params.tokenOut).id;
  entity.quantity = event.params.quantity;
  entity.executionValue = event.params.executionValue;
  entity.endTimestamp = event.params.endTimestamp;
  entity.fee = event.params.fee;
  entity.condition = getExecutionCondition(event.params.condition);
  entity.forkABI = getUniswapABI(event.params.forkABI);
  entity.executed = false;
  entity.withdrawn = false;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePositionExecuted(event: PositionExecutedEvent): void {
  let entity = new PositionExecuted(event.params.positionId.toString());

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let position = PositionCreated.load(event.params.positionId.toString());

  if (position) {
    position.executed = true;
    position.save();
  }

  entity.save();
}

export function handlePositionProlonged(event: PositionProlongedEvent): void {
  let entity = new PositionProlonged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.positionId = event.params.positionId;
  entity.newEndTimestamp = event.params.newEndTimestamp;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let position = PositionCreated.load(event.params.positionId.toString());

  if (position) {
    position.endTimestamp = event.params.newEndTimestamp;
    position.save();
  }

  entity.save();
}

export function handlePositionWithdrawn(event: PositionWithdrawnEvent): void {
  let entity = new PositionWithdrawn(event.params.positionId.toString());

  entity.wallet = event.params.wallet;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let position = PositionCreated.load(event.params.positionId.toString());

  if (position) {
    position.withdrawn = true;
    position.save();
  }

  entity.save();
}

function fetchOrCreateToken(tokenAddress: Address): Token {
  let tokenId = tokenAddress.toHex();
  let token = Token.load(tokenId);

  if (token === null) {
    token = new Token(tokenId);
    let contract = ERC20.bind(tokenAddress);

    // Fetch name
    let nameResult = contract.try_name();
    if (!nameResult.reverted) {
      token.name = nameResult.value;
    } else {
      log.warning("Failed to fetch name for token {}", [tokenId]);
      token.name = "Unknown";
    }

    // Fetch symbol
    let symbolResult = contract.try_symbol();
    if (!symbolResult.reverted) {
      token.symbol = symbolResult.value;
    } else {
      log.warning("Failed to fetch symbol for token {}", [tokenId]);
      token.symbol = "UNKNOWN";
    }

    // Fetch decimals
    let decimalsResult = contract.try_decimals();
    if (!decimalsResult.reverted) {
      token.decimals = new BigInt(decimalsResult.value);
    } else {
      log.warning("Failed to fetch decimals for token {}", [tokenId]);
      token.decimals = new BigInt(18); // Default to 18 if failed
    }

    token.address = tokenAddress;

    token.save();
  }

  return token as Token;
}
