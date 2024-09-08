"use client";

import { TrainerModel } from "@/lib/types";
import { useEffect, useState } from "react";
import { sampleTrainerModels } from "@/lib/data/sample-model-data";
import TrainerModelCard from "./model-card";
import StackLoadingSkeleton from "./stack-loading-skeleton";

export default function TrainingModels() {
    const [trainingModels, setTrainingModels] = useState<TrainerModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      setTimeout(() => {
        setTrainingModels(
          sampleTrainerModels.filter((model) => model.status === "Completed"),
        );
        setLoading(false);
      }, 1000);
    }, []);
  
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