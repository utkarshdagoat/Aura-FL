import { Bytes, Struct, UInt32, UInt64 } from "o1js";
import runtime from "..";
import { RuntimeModule, runtimeModule } from "@proto-kit/module";

export class Task extends Struct({
    name:Bytes(32),
    epochs:UInt64,
    modelType:UInt64,
    modelSize:UInt64,
    numOfLayers:UInt64,
    activationFunction:UInt64,
    Optimizer:UInt64,
}){
    public static from(name:Bytes,epochs:UInt64,modelType:UInt64,modelSize:UInt64,numOfLayers:UInt64,activationFunction:UInt64,Optimizer:UInt64):Task{
        return new Task({
            name,
            epochs,
            modelType,
            modelSize,
            numOfLayers,
            activationFunction,
            Optimizer,
        });
    }
};

type PublisherConfig = Record<string,never>;

@runtimeModule()
export class Publisher extends RuntimeModule<PublisherConfig>{}