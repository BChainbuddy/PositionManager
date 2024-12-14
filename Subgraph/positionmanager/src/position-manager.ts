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
} from "../generated/schema";

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
  let entity = new PositionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.wallet = event.params.wallet;
  entity.positionId = event.params.positionId;
  entity.dexRouter = event.params.dexRouter;
  entity.tokenIn = event.params.tokenIn;
  entity.tokenOut = event.params.tokenOut;
  entity.quantity = event.params.quantity;
  entity.executionValue = event.params.executionValue;
  entity.endTimestamp = event.params.endTimestamp;
  entity.fee = event.params.fee;
  entity.condition = getExecutionCondition(event.params.condition);
  entity.forkABI = getUniswapABI(event.params.forkABI);
  entity.executed = false;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePositionExecuted(event: PositionExecutedEvent): void {
  let entity = new PositionExecuted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.positionId = event.params.positionId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

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

  entity.save();
}

export function handlePositionWithdrawn(event: PositionWithdrawnEvent): void {
  let entity = new PositionWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.wallet = event.params.wallet;
  entity.positionId = event.params.positionId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
