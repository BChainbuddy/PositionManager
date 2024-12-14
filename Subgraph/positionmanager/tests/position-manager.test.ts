import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { DexRouterWhitelisted } from "../generated/schema"
import { DexRouterWhitelisted as DexRouterWhitelistedEvent } from "../generated/PositionManager/PositionManager"
import { handleDexRouterWhitelisted } from "../src/position-manager"
import { createDexRouterWhitelistedEvent } from "./position-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let dexRouter = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDexRouterWhitelistedEvent =
      createDexRouterWhitelistedEvent(dexRouter)
    handleDexRouterWhitelisted(newDexRouterWhitelistedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DexRouterWhitelisted created and stored", () => {
    assert.entityCount("DexRouterWhitelisted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DexRouterWhitelisted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "dexRouter",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
