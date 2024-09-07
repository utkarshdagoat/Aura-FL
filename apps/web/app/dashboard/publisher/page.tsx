"use client";

import { FilterModels, NewModel } from "@/components/dashboard/publisher";
import ModelCard from "@/components/dashboard/publisher/model-card";
import { sampleModelData } from "@/lib/data/sample-model-data";
import { FilterModesUnion, Model } from "@/lib/types";
import { useEffect, useState } from "react";

export default function PublisherDashboard() {
  const [modelData, setModelData] = useState<Model[]>([]);
  const [filteredModelData, setFilteredModelData] = useState<Model[]>([]);
  const [filter, setFilter] = useState<FilterModesUnion>("All");

  useEffect(() => {
    setModelData(sampleModelData);
    // TODO: Yaha kro fetching
  }, []);

  // Filter functionality
  useEffect(() => {
    if (filter === "All") {
      setFilteredModelData(modelData);
    } else {
      setFilteredModelData(
        modelData.filter((model) => model.status === filter)
      );
    }
  }, [filter, modelData]);

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-4xl">Greetings, fellow human 👋</h1>
        <p className="text-lg text-muted-foreground">
          Publish and share your models seamlessly here :)
        </p>
      </div>
      <div className="relative flex flex-row items-end justify-between space-y-2 from-theme_peach via-theme_purple/80 to-primary/60 py-6 after:absolute after:bottom-2 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-100 after:rounded-full after:bg-gradient-to-r">
        <h1 className="text-2xl">Your Models</h1>
        <div className="flex flex-row gap-2">
          <FilterModels filter={filter} setFilter={setFilter} />
          <NewModel />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {filteredModelData.map((model, index) => (
          <ModelCard {...model} key={index} />
        ))}
      </div>
    </>
  );
}
