"use client";

import { TrainerModel } from "@/lib/types";
import { useEffect, useState } from "react";
import { sampleTrainerModels } from "@/lib/data/sample-model-data";
import TrainerModelCard from "./model-card";
import StackLoadingSkeleton from "./stack-loading-skeleton";

export default function AvailableModels() {
  const [availableModels, setAvailableModels] = useState<TrainerModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setAvailableModels(
        sampleTrainerModels.filter((model) => model.status === "Available"),
      );
      setLoading(false);
    }, 1000);
  }, []);

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
