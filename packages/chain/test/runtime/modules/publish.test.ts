import "reflect-metadata"

import { TestingAppChain } from "@proto-kit/sdk";
import { Bool, PrivateKey, PublicKey, } from "o1js";
import { Publisher, Task } from "../../../src/runtime/modules/publish";
import { StakingRegistry } from "../../../src/runtime/modules/staking";
import { Balances } from "../../../src/runtime/modules/balance";
import { UInt64, TokenId, BalancesKey } from "@proto-kit/library";
describe("Publishing Testing", () => {
  let appChain = TestingAppChain.fromRuntime({
    Publisher,
    StakingRegistry,
    Balances
  })
  const alicePrivateKey = PrivateKey.random();
  const alice = alicePrivateKey.toPublicKey();

  const publisherPrivateKey = PrivateKey.random();
  const publisherPublicKey = publisherPrivateKey.toPublicKey();

  const slashingTreasuryPrivate = PrivateKey.random()
  const slashingTreasury = slashingTreasuryPrivate.toPublicKey()

  const admin = PrivateKey.random()
  const adminPublicKey = admin.toPublicKey()

  let publisher: Publisher
  let stakingRegistry: StakingRegistry
  let balance: Balances


  const clientsPrivateKeys = [PrivateKey.random(), PrivateKey.random(), PrivateKey.random()]
  const clients = clientsPrivateKeys.map((key) => key.toPublicKey())


  const task = Task.from(
    UInt64.from(1),
    UInt64.from(1),
    UInt64.from(1),
    UInt64.from(1),
    UInt64.from(1),
    UInt64.from(1),
    Bool.fromValue(false),
    alice,
    UInt64.from(1)
  )


  beforeAll(async () => {
    appChain = TestingAppChain.fromRuntime({
      Publisher,
      StakingRegistry,
      Balances
    });
    appChain.configurePartial({
      Runtime: {
        Publisher: {
          address: publisherPublicKey
        },
        StakingRegistry: {
          slashTreasury: slashingTreasury,
          admin: adminPublicKey
        },
        Balances: {
          totalSupply: UInt64.from(1_000_000_000)
        }
      },
    });
    await appChain.start();
    appChain.setSigner(alicePrivateKey);
    publisher = appChain.runtime.resolve("Publisher")
    stakingRegistry = appChain.runtime.resolve("StakingRegistry")
    balance = appChain.runtime.resolve("Balances")

  }, 1_000_000)

  it("Should increase balance", async () => {
    const tx = await appChain.transaction(alice, async () => {
      await balance.addBalance(alice, UInt64.from(1000000))
    })
    await tx.sign()
    await tx.send()
    const block = await appChain.produceBlock();
    expect(block?.transactions[0].status.toBoolean()).toBe(true)
    const balanceKey = new BalancesKey({
      tokenId: TokenId.from(0),
      address: alice
    })
    const balanceOfAlice = await appChain.query.runtime.Balances.balances.get(balanceKey)
    expect(balanceOfAlice?.toBigInt()).toBe(1000000n)
  }, 1_000_000)


  it("add task", async () => {
    const tx = await appChain.transaction(alice, async () => {
      await publisher.intitialize()
    })
    await tx.sign()
    await tx.send()
    const block1 = await appChain.produceBlock();
    expect(block1?.transactions[0].status.toBoolean()).toBe(true)
    const taskLength1 = await appChain.query.runtime.Publisher.TASKS_LENGTH.get()
    expect(taskLength1?.toString()).toBe("0")
    const tx1 = await appChain.transaction(alice, async () => {
      await publisher.addTask(
        UInt64.from(3),
        UInt64.from(1),
        UInt64.from(1),
        UInt64.from(1),
        UInt64.from(1),
        UInt64.from(1),
        UInt64.from(1)
      )
    })
    await tx1.sign()
    await tx1.send()

    const block = await appChain.produceBlock();
    expect(block?.transactions[0].status.toBoolean()).toBe(true)

    const publisherBalanceKey = new BalancesKey({
      tokenId: TokenId.from(0),
      address: publisherPublicKey
    })
    const aliceBalanceKey = new BalancesKey({
      tokenId: TokenId.from(0),
      address: alice
    })
    const publisherBalance = await appChain.query.runtime.Balances.balances.get(publisherBalanceKey)
    const aliceBalance = await appChain.query.runtime.Balances.balances.get(aliceBalanceKey)
    const taskLength = await appChain.query.runtime.Publisher.TASKS_LENGTH.get()
    expect(taskLength?.toString()).toBe("1")
    expect(publisherBalance?.toBigInt()).toBe(3n)
    expect(aliceBalance?.toBigInt()).toBe(999997n)

  }, 1_000_000);

  it("Should fund clients", async () => {
    for (let i = 0; i < clients.length; i++) {
      appChain.setSigner(clientsPrivateKeys[i])

      const tx = await appChain.transaction(clients[i], async () => {
        await balance.addBalance(clients[i], UInt64.from(1))
      })
      await tx.sign()
      await tx.send()
    }
    const block = await appChain.produceBlock();
    block?.transactions.forEach((tx) => {
      expect(tx.status.toBoolean()).toBe(true)
    })

    for (let i = 0; i < clients.length; i++) {
      const clientBalanceKey = new BalancesKey({
        tokenId: TokenId.from(0),
        address: clients[i]
      })
      const balanceOfClient = await appChain.query.runtime.Balances.balances.get(clientBalanceKey)
      expect(balanceOfClient?.toBigInt()).toBe(1n)
    }
  }, 1_000_000)


  it("should stake and add client", async () => {

    for (let i = 0; i < clients.length; i++) {
      appChain.setSigner(clientsPrivateKeys[i])
      const stakingTx = await appChain.transaction(clients[i], async () => {
        await stakingRegistry.stake(UInt64.from(1))
      })
      await stakingTx.sign()
      await stakingTx.send()
    }
    const block = await appChain.produceBlock();
    block?.transactions.forEach((tx) => {
      expect(tx.status.toBoolean()).toBe(true)
    })

    for (let i = 0; i < clients.length; i++) {
      const clientBalanceKey = new BalancesKey({
        tokenId: TokenId.from(0),
        address: clients[i]
      })
      const balanceOfClient = await appChain.query.runtime.Balances.balances.get(clientBalanceKey)
      expect(balanceOfClient?.toBigInt()).toBe(0n)
    }

  }, 1_000_000)

  it("should add clients", async () => {
    // async function addClient(client: PublicKey) {
    //   appChain.setSigner(publisherPrivateKey)
    //   const getClients = await appChain.query.runtime.Publisher.clients.get(UInt64.from(0))
    //   if(getClients === undefined) return;
    //   const findIndex = getClients?.findIndex((c) =>c.equals(PublicKey.empty()).toBoolean())
    //   console.log("findIndex", findIndex)
    //   if(findIndex === -1) throw new Error("No empty slot");
    //   const newArr = [...getClients]
    //   newArr[findIndex] = client
    //   const tx = await appChain.transaction(publisherPublicKey, async () => {
    //     await publisher.addClients(client, UInt64.from(0), newArr[0],newArr[1],newArr[2])
    //   })
    //   await tx.sign()
    //   await tx.send()
    // }
    appChain.setSigner(clientsPrivateKeys[0])
    const tx = await appChain.transaction(clients[0], async () => {
      await publisher.addClients(UInt64.from(0), clients[0], clients[1], clients[2])
    })
    await tx.sign()
    await tx.send()

    const block = await appChain.produceBlock();
    block?.transactions.forEach((tx) => {
      expect(tx.status.toBoolean()).toBe(true)
    })
    const clientsForTask = await appChain.query.runtime.Publisher.clients.get(UInt64.from(0))
    expect(clientsForTask?.value.length).toBe(3)
  }, 1_000_000)

  it("should complete task and distribute funds", async () => {
    appChain.setSigner(alicePrivateKey)
    const tx = await appChain.transaction(alice, async () => {
      await publisher.completeTask(UInt64.from(0))
    })
    await tx.sign()
    await tx.send()
    const block = await appChain.produceBlock();
    block?.transactions.forEach((tx) => {
      expect(tx.status.toBoolean()).toBe(true)
    })
    for (let i = 0; i < clients.length; i++) {
      const clientBalanceKey = new BalancesKey({
        tokenId: TokenId.from(0),
        address: clients[i]
      })
      const balanceOfClient = await appChain.query.runtime.Balances.balances.get(clientBalanceKey)
      expect(balanceOfClient?.toBigInt()).toBe(1n)
    }
  }, 1_000_000)
});

