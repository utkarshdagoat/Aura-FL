import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { Balance, BalancesKey, TokenId } from "@proto-kit/library";
import { PublicKey } from "o1js";
import { UInt64 } from "@proto-kit/library";
import { useCallback, useEffect } from "react";
import { useChainStore } from "./chain";
import { useWalletStore } from "./wallet";
import { HeadLayerProof } from "chain/src/runtime/zkPrograms/headLayer";
import { ClientTaskKey } from "chain/dist/runtime/modules/aggregator";

export interface AggregatorState {
    loading: boolean
    verified: {
        [key: number]: {
            [key: string]: boolean
        }
    }
    verifyInfrence: (client: Client, taskId: UInt64, clientId: PublicKey, proof: HeadLayerProof) => Promise<PendingTransaction>
    loadVerificationStatus: (client: Client, clientId: string) => Promise<void>
}

function isPendingTransaction(
    transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
    if (!(transaction instanceof PendingTransaction))
        throw new Error("Transaction is not a PendingTransaction");
}

export const tokenId = TokenId.from(0);

export const useAggStore = create<
    AggregatorState,
    [["zustand/immer", never]]
>(
    immer((set) => ({
        loading: Boolean(false),
        verified: {},
        verifyInfrence: async (client: Client, taskId: UInt64, clientId: PublicKey, proof: HeadLayerProof) => {
            const aggregate = client.runtime.resolve("Aggregator");
            const tx = await client.transaction(clientId, async () => {
                await aggregate.verifyInfrence(taskId, clientId, proof)
            });
            await tx.sign();
            await tx.send();
            isPendingTransaction(tx.transaction);
            return tx.transaction;
        },
        loadVerificationStatus: async (client: Client, clientId: string) => {

            const tasksLength = await client.query.runtime.Publisher.TASKS_LENGTH.get()
            if (tasksLength) {
                for (let i = 0; i < Number(tasksLength.toString()); i++) {
                    const key = ClientTaskKey.from(UInt64.from(i), PublicKey.fromBase58(clientId))
                    const query = await client.query.runtime.Aggregator.clientsProofVerified.get(key)
                    if (query) {
                        set((state) => {
                            state.verified[i][clientId] = query.toBoolean()
                        })
                    } else {
                        set((state) => {
                            state.verified[i][clientId] = false
                        })
                    }
                }
            }

        }
    })),
);

export const useVerificationStatusObserver = () => {
    const client = useClientStore();
    const chain = useChainStore();
    const wallet = useWalletStore();
    const agg = useAggStore();
  
    useEffect(() => {
      if (!client.client || !wallet.wallet) return;
  
      agg.loadVerificationStatus(client.client, wallet.wallet);
    }, [client.client, chain.block?.height, wallet.wallet]);
}

export const useVerify= () => {
    const client = useClientStore();
    const wallet = useWalletStore();
    const agg = useAggStore()
    return useCallback(async (proof: HeadLayerProof, taskId: number) => {
        if (!client.client || !wallet.wallet) return;
        const pendingTransaction = await agg.verifyInfrence(
            client.client,
            UInt64.from(taskId),
            PublicKey.fromBase58(wallet.wallet),
            proof
        );
        wallet.addPendingTransaction(pendingTransaction);
    }, [client.client, wallet.wallet]);
};

