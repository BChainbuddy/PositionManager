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
  positionId: BigInt
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
  duration: BigInt
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
      "duration",
      ethereum.Value.fromUnsignedBigInt(duration)
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
