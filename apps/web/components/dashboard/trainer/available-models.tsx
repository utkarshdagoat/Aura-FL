"use client";

import { TrainerModel } from "@/lib/types";
import { useEffect, useState } from "react";
import { sampleTrainerModels } from "@/lib/data/sample-model-data";
import TrainerModelCard from "./model-card";
import StackLoadingSkeleton from "./stack-loading-skeleton";
import { usePublisherStore } from "@/lib/stores/publisher";
import { useWalletStore } from "@/lib/stores/wallet";
import { useAggStore } from "@/lib/stores/aggregate";

export default function AvailableModels() {
  const [loading, setLoading] = useState<boolean>(false);
  const publisher = usePublisherStore()
  const [availableModels, setAvailableModels] = useState<TrainerModel[]>([]);
  const wallet = useWalletStore()
  const agg = useAggStore()
  useEffect(() => {
    // 1setLoading(publisher.loading)
    console.log(publisher.tasks)
    const availableModels: (TrainerModel | undefined)[] = publisher.tasks.map((task) => {
      if (!wallet.wallet) return;
      const isNotAClient = publisher.clients[task.id]?.find((client) => client === wallet.wallet) === undefined
      if (task.status === "Training" && isNotAClient  ) {
        return {
          ...task,
          status: "Available"
        }
      }
    })
    if (availableModels)
      setAvailableModels(availableModels.filter((model) => model !== undefined))
  }, [publisher.tasks, publisher.loading]);
  return (
    <>
      {loading ? (
        <StackLoadingSkeleton />
      ) : availableModels.length === 0 ? (
        <div className="mx-auto text-lg text-muted-foreground">
          No models available for now. Check back later! 🚀
        </div>
      ) : (
        availableModels.map((model, index) => (
          <TrainerModelCard {...model} key={index} />
        ))
      )}
    </>
  );
}
