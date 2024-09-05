import { TestingAppChain } from "@proto-kit/sdk";
import { Bool, Bytes, method, PrivateKey, UInt32, UInt64 } from "o1js";
import { Publisher, Task } from "../../../src/runtime/modules/publish";
import { log } from "@proto-kit/common";

log.setLevel("ERROR");

describe("balances", () => {
  it("add task", async () => {
    const appChain = TestingAppChain.fromRuntime({
      Publisher,
    });

    appChain.configurePartial({
      Runtime: {
        Publisher: {},
        Balances: {}
      },
    });

    await appChain.start();

    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    const task = Task.from(
      Bytes.fromHex("Task"),
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



    appChain.setSigner(alicePrivateKey);

    const publisher = appChain.runtime.resolve("Publisher");

    const tx1 = await appChain.transaction(alice, async () => {
      publisher.addTask(
        Bytes.fromHex("Task"),
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
    const queriedTask = await appChain.query.runtime.Publisher.tasks.get(UInt32.from(0));
    expect(queriedTask).toBe(task)

  }, 1_000_000);
});

