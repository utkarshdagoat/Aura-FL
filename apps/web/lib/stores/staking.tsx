import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { Client, useClientStore } from "./client";
import { PublicKey } from "o1js";
import { UInt64 } from "@proto-kit/library";
import { useWalletStore } from "./wallet";
import { useEffect } from "react";
import { useChainStore } from "./chain";
;

export interface StakingState {
    loading: boolean;
    hasStaked: boolean;
    isSlashed: boolean;
    stake: (amount: number, client: Client, address: string) => Promise<PendingTransaction>;
    unstake: (client: Client, address: string) => Promise<PendingTransaction>;
    getClientStatus: (client: Client, address: string) => Promise<void>;
}

function isPendingTransaction(
    transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
    if (!(transaction instanceof PendingTransaction))
        throw new Error("Transaction is not a PendingTransaction");
}


export const useStakingStore = create<
    StakingState,
    [["zustand/immer", never]]
>(
    immer((set) => ({
        loading: Boolean(false),
        hasStaked: false,
        isSlashed: false,
        stake: async (amount: number, client: Client, address: string) => {
            set((state) => {
                state.loading = true;
            });
            const sender = PublicKey.fromBase58(address);
            const StakingRegistry = client.runtime.resolve("StakingRegistry");
            const tx = await client.transaction(sender, async () => {
                await StakingRegistry.stake(UInt64.from(amount));
            });

            await tx.sign();
            await tx.send();
            isPendingTransaction(tx.transaction);
            return tx.transaction;
        },
        unstake: async (client: Client, address: string) => {
            set((state) => {
                state.loading = true;
            });
            const sender = PublicKey.fromBase58(address);
            const StakingRegistry = client.runtime.resolve("StakingRegistry");
            const tx = await client.transaction(sender, async () => {
                await StakingRegistry.unstake();
            });

            await tx.sign();
            await tx.send();
            isPendingTransaction(tx.transaction);
            return tx.transaction;
        },
        getClientStatus: async (client: Client, address: string) => {
            set((state) => {
                state.loading = true;
            });
            const hasStaked = await client.query.runtime.StakingRegistry.hasStaked.get(PublicKey.fromBase58(address));
            const isSlashed = await client.query.runtime.StakingRegistry.isSlashed.get(PublicKey.fromBase58(address));
            set((state) => {
                state.loading = false;
                state.hasStaked = hasStaked ? hasStaked.toBoolean() : false;
                state.isSlashed = isSlashed ? isSlashed.toBoolean() : false;
            });
        },

    })),
);


export const useStakingStatusObserver = () => {
    const client = useClientStore();
    const wallet = useWalletStore();
    const staking = useStakingStore();
    const chain = useChainStore()

    useEffect(() => {
        if (!client.client || !wallet.wallet) return;

        staking.getClientStatus(client.client, wallet.wallet);
    }, [client.client, wallet.wallet, chain.block?.txs]);
}

export const useStake = () => {
    const client = useClientStore();
    const staking = useStakingStore();
    const wallet = useWalletStore();

    return async (amount: number) => {
        if (!client.client || !wallet.wallet) return;

        const pendingTransaction = await staking.stake(amount, client.client, wallet.wallet);

        wallet.addPendingTransaction(pendingTransaction);
    };
}

export const useUnStake = () => {
    const client = useClientStore();
    const staking = useStakingStore();
    const wallet = useWalletStore();

    return async () => {
        if (!client.client || !wallet.wallet) return;

        const pendingTransaction = await staking.unstake(client.client, wallet.wallet);

        wallet.addPendingTransaction(pendingTransaction);
    };
}