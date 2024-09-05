import { TestingAppChain } from "@proto-kit/sdk";
import { Bool, Bytes, method, PrivateKey, UInt32, UInt64 } from "o1js";
import { Publisher, Task } from "../../../src/runtime/modules/publish";
import { log } from "@proto-kit/common";
import { hasUncaughtExceptionCaptureCallback } from "process";

log.setLevel("ERROR");

describe("balances", () => {
  let appChain = TestingAppChain.fromRuntime({
    Publisher,
  })
  const alicePrivateKey = PrivateKey.random();
  const alice = alicePrivateKey.toPublicKey();
  let publisher: Publisher

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
      Publisher
    });
    appChain.configurePartial({
      Runtime: {
        Publisher: {},
        Balances: {}
      },
    });
    await appChain.start();
    appChain.setSigner(alicePrivateKey);
    publisher = appChain.runtime.resolve("Publisher")

  }, 1_000_000)
  it("add task", async () => {
    const tx1 = await appChain.transaction(alice, async () => {
      await publisher.addTask(
        UInt64.from(1),
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
    const queriedTask = await appChain.query.runtime.Publisher.tasks.get(UInt32.from(0));
    expect(queriedTask).toStrictEqual(task);
  }, 1_000_000);

  it("complete task", async () => {


  })
});

