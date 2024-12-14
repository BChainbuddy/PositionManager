import {
  DexRouterWhitelisted as DexRouterWhitelistedEvent,
  LogBytes as LogBytesEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PositionCreated as PositionCreatedEvent,
  PositionExecuted as PositionExecutedEvent,
  PositionProlonged as PositionProlongedEvent,
  PositionWithdrawn as PositionWithdrawnEvent
} from "../generated/PositionManager/PositionManager"
import {
  DexRouterWhitelisted,
  LogBytes,
  OwnershipTransferred,
  PositionCreated,
  PositionExecuted,
  PositionProlonged,
  PositionWithdrawn
} from "../generated/schema"

export function handleDexRouterWhitelisted(
  event: DexRouterWhitelistedEvent
): void {
  let entity = new DexRouterWhitelisted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dexRouter = event.params.dexRouter

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogBytes(event: LogBytesEvent): void {
  let entity = new LogBytes(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePositionCreated(event: PositionCreatedEvent): void {
  let entity = new PositionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wallet = event.params.wallet
  entity.positionId = event.params.positionId
  entity.dexRouter = event.params.dexRouter
  entity.tokenIn = event.params.tokenIn
  entity.tokenOut = event.params.tokenOut
  entity.quantity = event.params.quantity
  entity.executionValue = event.params.executionValue
  entity.endTimestamp = event.params.endTimestamp
  entity.fee = event.params.fee
  entity.condition = event.params.condition
  entity.forkABI = event.params.forkABI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePositionExecuted(event: PositionExecutedEvent): void {
  let entity = new PositionExecuted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.positionId = event.params.positionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePositionProlonged(event: PositionProlongedEvent): void {
  let entity = new PositionProlonged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.positionId = event.params.positionId
  entity.newEndTimestamp = event.params.newEndTimestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePositionWithdrawn(event: PositionWithdrawnEvent): void {
  let entity = new PositionWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.wallet = event.params.wallet
  entity.positionId = event.params.positionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
