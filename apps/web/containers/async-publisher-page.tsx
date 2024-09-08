"use client";

import { FilterModels, NewModel } from "@/components/dashboard/publisher";
import PublishedModelCard from "@/components/dashboard/publisher/model-card";
import { Skeleton } from "@/components/ui/skeleton";
import { sampleModelData } from "@/lib/data/sample-model-data";
import { useClientStore } from "@/lib/stores/client";
import { useObserverTasks, usePublisherStore } from "@/lib/stores/publisher";
import { useWalletStore } from "@/lib/stores/wallet";
import { FilterModesUnion, PublishedModel } from "@/lib/types";
import { useEffect, useState } from "react";

export default function PublisherDashboard() {
  const [filteredModelData, setFilteredModelData] = useState<PublishedModel[]>([]);
  const [filter, setFilter] = useState<FilterModesUnion>("All");
  const publisher = usePublisherStore()
  const [isLoading, setLoading] = useState(publisher.loading);
  const [modelData, setModelData] = useState<PublishedModel[]>([]);
  const client = useClientStore()
  const wallet = useWalletStore()
  useEffect(() => {
    if (wallet.wallet && client.client)
      publisher.loadTasks(wallet.wallet, client.client)
    console.log(publisher.tasks)
  }, [])
  useEffect(()=>{
    setModelData(publisher.tasks)
  },[publisher.tasks])
  // Filter functionality
  useEffect(() => {
    if (filter === "All") {
      setFilteredModelData(modelData);
    } else {
      setFilteredModelData(
        modelData.filter((model) => model.status === filter),
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
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredModelData.length === 0 ? (
          <div className="mx-auto text-lg text-muted-foreground">
            No models for now. Create a new one or change the filter settings :)
          </div>
        ) : (
          filteredModelData.map((model, index) => (
            <PublishedModelCard {...model} key={index} />
          ))
        )}
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      {Array(8).map((_, index) => (
        <Skeleton key={index} className={` my-3 h-16 w-full`} />
      ))}
    </div>
  );
}

