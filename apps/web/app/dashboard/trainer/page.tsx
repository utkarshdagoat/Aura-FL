"use client";

import {
  StakeAlert,
  AvailableModels,
  TrainingModels,
  CompletedModels,
} from "@/components/dashboard/trainer";
import { useDashboardStore } from "@/lib/stores/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrainerDashboard() {
  const { hasTrainerStaked } = useDashboardStore();

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-4xl">Have some spare computing power?</h1>
        <p className="text-lg text-muted-foreground">
          Train models and earn MINA while you're at it. 🚀
        </p>
      </div>
      {!hasTrainerStaked ? (
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
              <TabsTrigger
                value="Completed"
                className="text-base"
                variant={"outline"}
              >
                Completed
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Available">
              <AvailableModels />
            </TabsContent>
            <TabsContent value="Training">
              <TrainingModels />
            </TabsContent>
            <TabsContent value="Completed">
              <CompletedModels />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
