import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PublishedModel } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export default function PublishedModelCard(props: PublishedModel) {
  const handleAction = () => {
    //TODO: Add model action
  };
  return (
    <div className="w-full rounded-md border p-4">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex w-full flex-row items-center justify-between">
          <h1 className="text-2xl">{props.name}</h1>
          <div className="flex flex-row gap-1">
            <TrainingStatus status={props.status} />
            {props.status === "Waiting For Clients" && (
              <p className="text-muted-foreground animate-pulse">(0/3)</p>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Badge>{props.type}</Badge>
          <Separator orientation="vertical" />
          <div className="flex flex-row gap-2">
            <Badge variant={"outline"}>{props.activationFunction}</Badge>
            <Badge variant={"outline"}>{props.optimizer}</Badge>
            <Badge variant={"outline"}>{props.layers} layers</Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="relative flex w-full flex-1 flex-row items-center gap-4 rounded-full bg-accent/60 px-4 py-3">
          <div>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              Fee per epoch <ArrowRight className="h-4 w-4" />
            </span>{" "}
            {props.feePerEpoch} MINA
          </div>
          <Separator orientation="vertical" />
          <div>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              Epochs <ArrowRight className="h-4 w-4" />
            </span>{" "}
            {props.epochs}
          </div>
          <Button
            className="gradient-metal absolute right-1 rounded-full border bg-gradient-to-tr"
            variant={"outline"}
            onClick={handleAction}
          >
            Action Button
          </Button>
        </div>
      </div>
    </div>
  );
}

function TrainingStatus({ status }: { status: PublishedModel["status"] }) {
  if (status === "Training") {
    return (
      <div className="flex animate-pulse items-center gap-2 text-muted-foreground">
        <div className="h-4 w-4 rounded-full bg-theme_peach"></div>
        Training
      </div>
    );
  } else if (status === "Completed") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-primary"></div>
        Completed
      </div>
    );
  } else if (status === "Waiting For Clients") {
    return (
      <div className="flex animate-pulse items-center gap-2 text-muted-foreground">
        <div className="h-4 w-4 rounded-full bg-theme_purple"></div>
        Waiting For Clients
      </div>
    );
  }
}
