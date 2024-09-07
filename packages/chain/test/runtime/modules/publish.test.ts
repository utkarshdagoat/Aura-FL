import "reflect-metadata"

import { TestingAppChain } from "@proto-kit/sdk";
import { Bool, PrivateKey, } from "o1js";
import { Publisher, Task } from "../../../src/runtime/modules/publish";
import { StakingRegistry } from "../../../src/runtime/modules/staking";
import { UInt64, UInt32, Balances, TokenId } from "@proto-kit/library";
describe("balances", () => {
  let appChain = TestingAppChain.fromRuntime({
    Publisher,
    StakingRegistry
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
  let balances: Balances<unknown>


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
      StakingRegistry
    });
    appChain.configurePartial({
      Runtime: {
        Publisher: {
          address: publisherPublicKey
        },
        Balances: {},
        StakingRegistry: {
          slashTreasury: slashingTreasury,
          admin: adminPublicKey
        }
      },
    });
    await appChain.start();
    appChain.setSigner(alicePrivateKey);
    publisher = appChain.runtime.resolve("Publisher")
    stakingRegistry = appChain.runtime.resolve("StakingRegistry")
    balances = appChain.runtime.resolve("Balances")

    balances.mint(TokenId.from(0), alice, UInt64.from(1_000_000))
    balances.mint(TokenId.from(0), publisherPublicKey, UInt64.from(1_000_000))
    balances.mint(TokenId.from(0), slashingTreasury, UInt64.from(1_000_000))
    balances.mint(TokenId.from(0), adminPublicKey, UInt64.from(1_000_000))
    balances.mint(TokenId.from(0), clients[0], UInt64.from(1_000_000))
    balances.mint(TokenId.from(0), clients[1], UInt64.from(1_000_000))
    balances.mint(TokenId.from(0), clients[2], UInt64.from(1_000_000))
  }, 1_000_000)


  it("add task", async () => {
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
    const queriedTask = await appChain.query.runtime.Publisher.tasks.get(UInt64.from(0));
    expect(queriedTask).toStrictEqual(task);

    //check balances
    const aliceBalance = await balances.getBalance(TokenId.from(0), alice);
    const publisherBalance = await balances.getBalance(TokenId.from(0), publisherPublicKey);
    expect(aliceBalance).toBe(UInt64.from(999_997));
    expect(publisherBalance).toBe(UInt64.from(1_000_003));
  }, 1_000_000);

  it("complete task", async () => {


  }, 1_000_100)

  it("should stake and add client", async () => {

    for (let i = 0; i < clients.length; i++) {
      appChain.setSigner(clientsPrivateKeys[i])
      const stakingTx = await appChain.transaction(clients[i], async () => {
        await stakingRegistry.stake(UInt64.from(1))
      })
      await stakingTx.sign()
      await stakingTx.send()

      const tx = await appChain.transaction(clients[i], async () => {
        await publisher.addClient(clients[i], UInt64.from(0))
      })
      await tx.sign()
      await tx.send()
    }
    const block = await appChain.produceBlock();
    block?.transactions.forEach((tx) => {
      expect(tx.status.toBoolean()).toBe(true)
    })

    for (let i = 0; i < clients.length; i++) {
      const balance = await balances.getBalance(
        TokenId.from(0),
        clients[i]
      )
      expect(balance).toBe(UInt64.from(999_999))
    }
  }, 1_000_000)

  it("should distribute funds", async () => {
    appChain.setSigner(alicePrivateKey)
    const tx = await appChain.transaction(alice, async () => {
      await publisher.completeTask(UInt64.from(0))
    })
    tx.sign()
    tx.send()
    const block = await appChain.produceBlock()
    expect(block?.transactions[0].status.toBoolean()).toBe(true)
    const task = await appChain.query.runtime.Publisher.tasks.get(UInt64.from(0))
    expect(task?.completed.toBoolean()).toBe(true)
    for (let i = 0; i < clients.length; i++) {
      const balance = await balances.getBalance(TokenId.from(0), clients[i])
      expect(balance).toBe(UInt64.from(1_000_000))
    }
  }, 1_000_000)
});

