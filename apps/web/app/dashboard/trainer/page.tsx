"use client";

import {
  StakeAlert,
  AvailableModels,
  TrainingModels,
  CompletedModels,
} from "@/components/dashboard/trainer";
import { useDashboardStore } from "@/lib/stores/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStakingStore } from "@/lib/stores/staking";

export default function TrainerDashboard() {
  const staking = useStakingStore()
  return (
    <>
      {!staking.hasStaked? (
        <StakeAlert />
      ) : (
        <div>
          <Tabs defaultValue="Available" className="mt-4 w-full">
            <TabsList
              className="grid w-[600px] grid-cols-3"
              variant={"outline"}
            >
              <TabsTrigger
                value="Available"
                className="text-base"
                variant={"outline"}
              >
                Available
              </TabsTrigger>
              <TabsTrigger
                value="Training"
                className="text-base"
                variant={"outline"}
              >
                Training
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Available">
              <AvailableModels />
            </TabsContent>
            <TabsContent value="Training">
              <TrainingModels />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
