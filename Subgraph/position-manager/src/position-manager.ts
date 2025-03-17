import {
  DexRouterWhitelisted as DexRouterWhitelistedEvent,
  PositionCreated as PositionCreatedEvent,
  PositionExecuted as PositionExecutedEvent,
  PositionProlonged as PositionProlongedEvent,
  PositionWithdrawn as PositionWithdrawnEvent,
  DexRouterRemoved as DexRouterRemoved,
} from "../generated/PositionManager/PositionManager";
import {
  WhitelistedDexRouter,
  Position,
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
      return "V3";
    case 1:
      return "V2";
    default:
      return "Unknown"; // Handle unexpected values
  }
}

export function handleDexRouterWhitelisted(
  event: DexRouterWhitelistedEvent
): void {
  let entity = new WhitelistedDexRouter(event.params.dexRouter.toHex());

  entity.isActive = true;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDexRouterRemoved(event: DexRouterRemoved): void {
  let entity = WhitelistedDexRouter.load(event.params.dexRouter.toHex());
  if (entity) {
    entity.isActive = false;
    entity.save();
  } else {
    log.warning("Attempted to remove non-whitelisted DexRouter: {}", [
      event.params.dexRouter.toHex(),
    ]);
  }
}

export function handlePositionCreated(event: PositionCreatedEvent): void {
  let entity = new Position(event.params.positionId.toString());

  entity.wallet = event.params.wallet;
  entity.tokenIn = fetchOrCreateToken(event.params.tokenIn).id;
  entity.tokenOut = fetchOrCreateToken(event.params.tokenOut).id;
  entity.quantity = event.params.quantity;
  entity.executionValue = event.params.executionValue;
  entity.endTimestamp = event.params.endTimestamp;
  entity.fee = event.params.fee;
  entity.condition = getExecutionCondition(event.params.condition);
  entity.forkABI = getUniswapABI(event.params.forkABI);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.status = "ACTIVE";

  let dexRouter = WhitelistedDexRouter.load(event.params.dexRouter.toHex());
  if (dexRouter) {
    entity.dexRouter = dexRouter.id;
  } else {
    log.warning("WhitelistedDexRouter {} not found for Position {}", [
      event.params.dexRouter.toHex(),
      event.params.positionId.toString(),
    ]);
  }

  entity.save();
}

export function handlePositionExecuted(event: PositionExecutedEvent): void {
  let entity = new PositionExecuted(event.params.positionId.toString());

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.executedPosition = event.params.positionId.toString();

  let position = Position.load(event.params.positionId.toString());

  if (position) {
    position.status = "EXECUTED";
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

  let position = Position.load(event.params.positionId.toString());

  if (position) {
    position.endTimestamp = event.params.newEndTimestamp;
    position.save();
  }

  entity.position = event.params.positionId.toString();

  entity.save();
}

export function handlePositionWithdrawn(event: PositionWithdrawnEvent): void {
  let entity = new PositionWithdrawn(event.params.positionId.toString());

  entity.wallet = event.params.wallet;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.withdrawnPosition = event.params.positionId.toString();

  let position = Position.load(event.params.positionId.toString());

  if (position) {
    position.status = "WITHDRAWN";
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
      token.decimals = BigInt.fromI32(decimalsResult.value);
    } else {
      log.warning("Failed to fetch decimals for token {}", [tokenId]);
      token.decimals = BigInt.fromI32(18);
    }

    token.address = tokenAddress;

    token.save();
  }

  return token as Token;
}
