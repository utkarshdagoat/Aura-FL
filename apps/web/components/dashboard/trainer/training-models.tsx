"use client";

import { TrainerModel } from "@/lib/types";
import { useEffect, useState } from "react";
import { sampleTrainerModels } from "@/lib/data/sample-model-data";
import TrainerModelCard from "./model-card";
import StackLoadingSkeleton from "./stack-loading-skeleton";
import { usePublisherStore } from "@/lib/stores/publisher";
import { useWalletStore } from "@/lib/stores/wallet";

export default function TrainingModels() {
  const [trainingModels, setTrainingModels] = useState<TrainerModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const publisher = usePublisherStore()
  const wallet = useWalletStore()

  useEffect(() => {
    const trainingModelsmap: (TrainerModel | undefined)[] = publisher.tasks.map((task) => {
      const isAClient = publisher.clients[task.id]?.find((client) => client === wallet.wallet) !== undefined
      console.log(isAClient)
      if (task.status === "Training" && isAClient) {
        return {
          ...task,
          status: "Training"
        }
      }
    })
    console.log(trainingModelsmap)
    setTrainingModels(trainingModelsmap.filter((model) => model !== undefined))
  }, [publisher.tasks, publisher.clients]);

  return (
    <>
      {loading ? (
        <StackLoadingSkeleton />
      ) : trainingModels.length === 0 ? (
        <div className="mx-auto text-lg text-muted-foreground">
          No models being trained right now. Check available models! 🚀
        </div>
      ) : (
        trainingModels.map((model, index) => (
          <TrainerModelCard {...model} key={index} />
        ))
      )}
    </>
  );
}