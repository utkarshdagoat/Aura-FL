import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { Task } from "chain/src/runtime/modules/publish";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { Balance, BalancesKey, TokenId, UInt64 } from "@proto-kit/library";
import { PublicKey } from "o1js";
import { useCallback, useEffect } from "react";
import { useChainStore } from "./chain";
import { useWalletStore } from "./wallet";
import { client } from "chain";
import { EnumToNumberMap, ModelTypeFromNumber, NumberTOActivationEnum, NumberToOptimizerEnum, PublishedModel } from "../types";
import axios from "axios"
import { CREATE_TASK, GETALLTASKS, GETCLIENTS } from "../backend";
import { stat } from "fs";
import { ClientTaskKey } from "chain/dist/runtime/modules/aggregator";



export interface PublisherState {
    loading: boolean;
    taskLength: number;
    tasks: PublishedModel[],
    clients: {
        [key: number]: string[]
    },
    addTask: (params: addTaskParams) => Promise<PendingTransaction>,
    completeTask: (taskId: number, client: Client, address: string) => Promise<PendingTransaction>,
    loadTasks: (wallet: string, client: Client) => void,
    addClients: (taskId: number, clientOne: PublicKey, clientTwo: PublicKey, clientThree: PublicKey, client: Client, address: string) => Promise<PendingTransaction>,
}

function isPendingTransaction(
    transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
    if (!(transaction instanceof PendingTransaction))
        throw new Error("Transaction is not a PendingTransaction");
}

interface addTaskParams {
    epochs: number;
    modelSize: number;
    modelType: number;
    numOfLayers: number;
    activationFunction: number;
    Optimizer: number;
    feePerEpoch: number;
    client: Client;
    signer: string;
    name:string;
}

export const tokenId = TokenId.from(0);

export const usePublisherStore = create<
    PublisherState,
    [["zustand/immer", never]]
>(
    immer((set) => ({
        loading: Boolean(false),
        taskLength: 0,
        tasks: [],
        clients: {},
        loadTasks: async (wallet: string, client: Client) => {
            set((state) => {
                state.loading = true;
            })
            const taskLength = await client.query.runtime.Publisher.TASKS_LENGTH.get();
            const offChainTasks = await axios.get(GETALLTASKS)
            console.log(offChainTasks.data)
            if (taskLength === undefined) {
                const publisher = client.runtime.resolve("Publisher");
                const tx = await client.transaction(PublicKey.fromBase58(wallet), async () => {
                    await publisher.intitialize();
                })
                await tx.sign()
                await tx.send()
                isPendingTransaction(tx.transaction)
                return false;
            }
            const upperBound = taskLength ? Number(taskLength.toBigInt()) : 3;
            const tasks: PublishedModel[] = []
           
            for (let i = 0; i <= upperBound; i++) {
                const task = await client.query.runtime.Publisher.tasks.get(UInt64.from(i));
                if (task){
                    const offChainTask = offChainTasks.data.data.find((task:any)=>task.onChainId===i)
                    console.log(offChainTask)
                    tasks.push({
                        id: i,
                        name: offChainTask?  offChainTask.title : "Task",
                        type: ModelTypeFromNumber[task.modelType.toString()],
                        layers: Number(task.numOfLayers.toBigInt()),
                        feePerEpoch: Number(task.feePerEpoch.toBigInt()),
                        epochs: Number(task.epochs.toBigInt()),
                        activationFunction: NumberTOActivationEnum[task.activationFunction.toString()],
                        optimizer: NumberToOptimizerEnum[task.Optimizer.toString()],
                        status:task.completed.toBoolean() ? "Completed":"Training",
                        offChainId: offChainTask? offChainTask.id : undefined
                    });
                    if(offChainTask){
                        const clientsData =await axios.get(GETCLIENTS(Number(offChainTask.id)))
                        const clientsDataClean = clientsData.data.data.map((client:any)=>(client.address))
                        set((state)=>{
                            state.clients[i] = clientsDataClean
                        })
                    }
                }
            }
            set((state) => {
                state.tasks = tasks.reverse();
                state.taskLength = Number(taskLength.toString())
                state.loading = false;
            })
        },
        addTask: async (params: addTaskParams) => {
            const publisher = params.client.runtime.resolve("Publisher")
            const sender = PublicKey.fromBase58(params.signer)
            const taskLength = await client.query.runtime.Publisher.TASKS_LENGTH.get();
            const tx = await params.client.transaction(sender, async () => {
                await publisher.addTask(
                    UInt64.from(params.epochs),
                    UInt64.from(params.modelType),
                    UInt64.from(params.modelSize),
                    UInt64.from(params.numOfLayers),
                    UInt64.from(params.activationFunction),
                    UInt64.from(params.Optimizer),
                    UInt64.from(params.feePerEpoch)
                )
            })
            await tx.sign()
            await tx.send()
            isPendingTransaction(tx.transaction)
            const res =  await axios.post(CREATE_TASK,{
                onChainId:Number(taskLength?.toString()),
                name:params.name
            },{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            })
            console.log(res)
            return tx.transaction;
        },
        completeTask: async (taskId: number, client: Client, address: string) => {
            const sender = PublicKey.fromBase58(address)
            const publisher = client.runtime.resolve("Publisher")
            const tx = await client.transaction(sender, async () => {
                await publisher.completeTask(UInt64.from(taskId))
            })
            await tx.sign()
            await tx.send()
            isPendingTransaction(tx.transaction)
            return tx.transaction
        },
        addClients: async (
            taskId: number,
            clientOne: PublicKey,
            clientTwo: PublicKey,
            clientThree: PublicKey,
            client: Client,
            address: string
        ) => {
            const sender = PublicKey.fromBase58(address)
            const publisher = client.runtime.resolve("Publisher")
            const tx = await client.transaction(sender, async () => {
                await publisher.addClients(
                    UInt64.from(taskId),
                    clientOne,
                    clientTwo,
                    clientThree
                )
            })
            await tx.sign()
            await tx.send()
            isPendingTransaction(tx.transaction)
            return tx.transaction
        },
    })),
);

export const useObserverTasks = () => {
    const chain = useChainStore()
    const publisher = usePublisherStore()
    const client = useClientStore()
    const wallet = useWalletStore()
    useEffect(() => {
        if (wallet.wallet && client.client)
            publisher.loadTasks(wallet.wallet, client.client)
    }, [chain.block?.txs, client.client, wallet.wallet])
}


interface useAddTasksParams {
    epochs: number;
    modelSize: number;
    modelType: number;
    numOfLayers: number;
    activationFunction: number;
    Optimizer: number;
    feePerEpoch: number;
    name:string
}
export const useAddTasks = () => {
    const client = useClientStore();
    const wallet = useWalletStore();
    const publisher = usePublisherStore()
    return useCallback(async (params: useAddTasksParams) => {
        if (!client.client || !wallet.wallet) return;
        console.log("faucet")
        const pendingTransaction = await publisher.addTask({
            ...params,
            client: client.client,
            signer: wallet.wallet
        })
        wallet.addPendingTransaction(pendingTransaction);
    }, [client.client, wallet.wallet]);
}
export const useCompleteTask = () => {
    const client = useClientStore();
    const wallet = useWalletStore();
    const publisher = usePublisherStore()
    return useCallback(async (taskId: number) => {
        if (!client.client || !wallet.wallet) return;
        console.log("faucet")
        const pendingTransaction = await publisher.completeTask(
            taskId,
            client.client,
            wallet.wallet
        )
        wallet.addPendingTransaction(pendingTransaction);
    }, [client.client, wallet.wallet]);
}
export const useAddClients = (taskId: number, clientOne: string, clientTwo: string, clientThree: string) => {
    const client = useClientStore();
    const wallet = useWalletStore();
    const publisher = usePublisherStore()
    return useCallback(async () => {
        if (!client.client || !wallet.wallet) return;
        console.log("faucet")
        const pendingTransaction = await publisher.addClients(
            taskId,
            PublicKey.fromBase58(clientOne),
            PublicKey.fromBase58(clientTwo),
            PublicKey.fromBase58(clientThree),
            client.client,
            wallet.wallet
        )
        wallet.addPendingTransaction(pendingTransaction);
    }, [client.client, wallet.wallet]);
}


