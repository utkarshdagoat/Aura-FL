import { TrainerModel } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrainerModelCard(props: TrainerModel) {
  const handleAccept = () => {
    //TODO: Add model action
  };

  const handleVerify = () => {

  }

  const handlePush = () => {

  }
  return (
    <div className="w-full space-y-4 rounded-md border p-4">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex w-full flex-row items-center justify-between">
          <h1 className="inline-flex items-center gap-4 text-2xl">
            {props.name} <Separator orientation="vertical" />
            <span className="underline-theme font-bold">
              {(props.feePerEpoch * props.epochs).toFixed(4)} MINA
            </span>
          </h1>
          <div>
            <TrainingStatus status={props.status} />
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
          {props.status === "Available" && (
            <Button
              className=" absolute right-1 rounded-full border "
              onClick={handleAccept}
            >
              Accept
            </Button>
          )}
          {props.status === "Completed" && (
            <div className="absolute right-1 flex flex-row items-center gap-4">
              <Button
                className=" rounded-full border"
                onClick={handleVerify}
              >
                Verify your inference
              </Button>

              <Button
                className=" rounded-full border"
                onClick={handlePush}
              >
                Send params
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrainingStatus({ status }: { status: TrainerModel["status"] }) {
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
  } else if (status === "Available") {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="h-4 w-4 rounded-full bg-theme_purple"></div>
        Available
      </div>
    );
  }
}
