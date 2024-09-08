"use client";

import { TrainerModel } from "@/lib/types";
import { useEffect, useState } from "react";
import { sampleTrainerModels } from "@/lib/data/sample-model-data";
import TrainerModelCard from "./model-card";
import StackLoadingSkeleton from "./stack-loading-skeleton";

export default function CompletedModels() {
  const [completedModels, setCompletedModels] = useState<TrainerModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setCompletedModels(
        sampleTrainerModels.filter((model) => model.status === "Completed"),
      );
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {loading ? (
        <StackLoadingSkeleton />
      ) : completedModels.length === 0 ? (
        <div className="mx-auto text-lg text-muted-foreground">
          No models trained for now. Check available models! 🚀
        </div>
      ) : (
        completedModels.map((model, index) => (
          <TrainerModelCard {...model} key={index} />
        ))
      )}
    </>
  );
}
