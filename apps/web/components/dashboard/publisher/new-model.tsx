import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectBox } from "@/components/ui/select-box";
import { useEffect, useState } from "react";
import {
  ActivationEnumToNumber,
  ActivationFunctionTypeEnum,
  EnumToNumberMap,
  ModelTypeEnum,
  OptimizerToNumber,
  OptimizerTypeEnum,
} from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { useAddTasks } from "@/lib/stores/publisher";

type FormState = {
  name: string | null;
  model: ModelTypeEnum | null;
  activationFunction: ActivationFunctionTypeEnum | null;
  optimizer: OptimizerTypeEnum | null;
  layers: number | null;
  feePerEpoch: number | null;
  epochs: number | null;
};

export default function NewModel() {
  const ModelTypeEnums: string[] = Object.values(ModelTypeEnum);
  const ActivationFunctionTypeEnums: string[] = Object.values(
    ActivationFunctionTypeEnum,
  );
  const OptimizerTypeEnums: string[] = Object.values(OptimizerTypeEnum);
  const addTask = useAddTasks()

  const [formState, setFormState] = useState<FormState>({
    name: null,
    model: null,
    activationFunction: null,
    optimizer: null,
    layers: null,
    feePerEpoch: null,
    epochs: 1,
  });

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    console.log("Field", field, "Value", value);
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const isFormFilled = Object.values(formState).every(
    (value) => value !== null,
  );

  const handleSubmit = () => {
    console.log("Form submitted", formState);
    if (formState.epochs && formState.layers && formState.feePerEpoch && formState.model && formState.activationFunction
      && formState.optimizer && formState.name
    )
      addTask({
        epochs: formState.epochs,
        modelSize:1,
        modelType: EnumToNumberMap[formState.model],
        numOfLayers: formState.layers,
        activationFunction: ActivationEnumToNumber[formState.activationFunction],
        Optimizer: OptimizerToNumber[formState.optimizer],
        feePerEpoch: formState.feePerEpoch,
        name:formState.name
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gradient-metal w-32 rounded-full border bg-gradient-to-tr">
          New Model
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/50 backdrop-blur-md">
        <DialogHeader className="decorate-theme pb-4">
          <DialogTitle className="text-2xl">Publish your model</DialogTitle>
          <DialogDescription className="pb-2">
            Tell us how you want your model to be, and we'll take care of the
            rest.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-1 flex flex-col gap-4 *:space-y-1">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Model Name"
              onChange={(e) => handleChange("name", e.target.value)}
              defaultValue={formState.name || ""}
            />
          </div>
          <div className="flex flex-row gap-4 *:flex-1">
            <div>
              <Label>Type</Label>
              <SelectBox
                options={ModelTypeEnums}
                value={formState.model}
                setValue={(value) => handleChange("model", value)}
                placeholder="Select model type..."
              />
            </div>
            <div>
              <Label>Activation Function</Label>
              <SelectBox
                options={ActivationFunctionTypeEnums}
                value={formState.activationFunction}
                setValue={(value) => handleChange("activationFunction", value)}
                placeholder="Select function..."
              />
            </div>
          </div>
          <div className="flex flex-row gap-4 *:flex-1">
            <div>
              <Label>Optimizer</Label>
              <SelectBox
                options={OptimizerTypeEnums}
                value={formState.optimizer}
                setValue={(value) => handleChange("optimizer", value)}
                placeholder="Select optimizer..."
              />
            </div>
            <div>
              <Label>No. of Layers</Label>
              <Input
                type="number"
                placeholder="No. of layers"
                onChange={(e) =>
                  handleChange("layers", parseInt(e.target.value))
                }
                defaultValue={formState.layers || ""}
              />
            </div>
          </div>
          <Separator />
          <div>
            <Label>No. of epochs</Label>
            <Input
              type="number"
              placeholder="No. of epochs"
              onChange={(e) => handleChange("epochs", parseInt(e.target.value))}
              defaultValue={formState.epochs || ""}
            />
          </div>
          <div>
            <Label>Fee per epoch</Label>
            <Input
              type="number"
              placeholder="Fee per epoch (in ETH)"
              onChange={(e) =>
                handleChange("feePerEpoch", parseFloat(e.target.value))
              }
              defaultValue={formState.feePerEpoch || ""}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!isFormFilled}
            className="rounded-full"
            size={"lg"}
            variant={"shine"}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
