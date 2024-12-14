import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  DexRouterWhitelisted,
  LogBytes,
  OwnershipTransferred,
  PositionCreated,
  PositionExecuted,
  PositionProlonged,
  PositionWithdrawn
} from "../generated/PositionManager/PositionManager"

export function createDexRouterWhitelistedEvent(
  dexRouter: Address
): DexRouterWhitelisted {
  let dexRouterWhitelistedEvent = changetype<DexRouterWhitelisted>(
    newMockEvent()
  )

  dexRouterWhitelistedEvent.parameters = new Array()

  dexRouterWhitelistedEvent.parameters.push(
    new ethereum.EventParam("dexRouter", ethereum.Value.fromAddress(dexRouter))
  )

  return dexRouterWhitelistedEvent
}

export function createLogBytesEvent(data: Bytes): LogBytes {
  let logBytesEvent = changetype<LogBytes>(newMockEvent())

  logBytesEvent.parameters = new Array()

  logBytesEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return logBytesEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPositionCreatedEvent(
  wallet: Address,
  positionId: BigInt,
  dexRouter: Address,
  tokenIn: Address,
  tokenOut: Address,
  quantity: BigInt,
  executionValue: BigInt,
  endTimestamp: BigInt,
  fee: i32,
  condition: i32,
  forkABI: i32
): PositionCreated {
  let positionCreatedEvent = changetype<PositionCreated>(newMockEvent())

  positionCreatedEvent.parameters = new Array()

  positionCreatedEvent.parameters.push(
    new ethereum.EventParam("wallet", ethereum.Value.fromAddress(wallet))
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam("dexRouter", ethereum.Value.fromAddress(dexRouter))
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam("tokenIn", ethereum.Value.fromAddress(tokenIn))
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam("tokenOut", ethereum.Value.fromAddress(tokenOut))
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "quantity",
      ethereum.Value.fromUnsignedBigInt(quantity)
    )
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "executionValue",
      ethereum.Value.fromUnsignedBigInt(executionValue)
    )
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTimestamp",
      ethereum.Value.fromUnsignedBigInt(endTimestamp)
    )
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fee",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(fee))
    )
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "condition",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(condition))
    )
  )
  positionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "forkABI",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(forkABI))
    )
  )

  return positionCreatedEvent
}

export function createPositionExecutedEvent(
  positionId: BigInt
): PositionExecuted {
  let positionExecutedEvent = changetype<PositionExecuted>(newMockEvent())

  positionExecutedEvent.parameters = new Array()

  positionExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )

  return positionExecutedEvent
}

export function createPositionProlongedEvent(
  positionId: BigInt,
  newEndTimestamp: BigInt
): PositionProlonged {
  let positionProlongedEvent = changetype<PositionProlonged>(newMockEvent())

  positionProlongedEvent.parameters = new Array()

  positionProlongedEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  positionProlongedEvent.parameters.push(
    new ethereum.EventParam(
      "newEndTimestamp",
      ethereum.Value.fromUnsignedBigInt(newEndTimestamp)
    )
  )

  return positionProlongedEvent
}

export function createPositionWithdrawnEvent(
  wallet: Address,
  positionId: BigInt
): PositionWithdrawn {
  let positionWithdrawnEvent = changetype<PositionWithdrawn>(newMockEvent())

  positionWithdrawnEvent.parameters = new Array()

  positionWithdrawnEvent.parameters.push(
    new ethereum.EventParam("wallet", ethereum.Value.fromAddress(wallet))
  )
  positionWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )

  return positionWithdrawnEvent
}
