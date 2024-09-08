export enum ModelTypeEnum {
  CNN = "CNN",
  RNN = "RNN",
  MLP = "LSTM",
}
type ModelTypeUnion = `${ModelTypeEnum}`;

export const EnumToNumberMap: {
  [key: string]: number
} = {
  "CNN": 1,
  "RNN": 2,
  "LSTM": 3
}
export const ModelTypeFromNumber :{
  [key: string]: ModelTypeUnion
} = {
  "1": "CNN",
  "2": "RNN",
  "3": "LSTM"
}

export enum ActivationFunctionTypeEnum {
  ReLU = "ReLU",
  Sigmoid = "Sigmoid",
  Tanh = "Tanh",
}
type ActivationFunctionTypeUnion = `${ActivationFunctionTypeEnum}`;
export const ActivationEnumToNumber: {
  [key: string]: number
} = {
  "ReLU": 1,
  "Sigmoid": 2,
  "Tanh": 3
}
export const NumberTOActivationEnum :  {
  [key: string]: ActivationFunctionTypeUnion
} = {
  "1": "ReLU",
  "2": "Sigmoid",
  "3": "Tanh"
}

export enum OptimizerTypeEnum {
  Adam = "Adam",
  SGD = "SGD",
  RMSProp = "RMSProp",
}

export const OptimizerToNumber: {
  [key: string]: number
} = {
  "Adam": 1,
  "SGD": 2,
  "RSMProp": 3
}
export const NumberToOptimizerEnum: {
  [key: string]: OptimizerTypeUnion
} = {
  "1": "Adam",
  "2": "SGD",
  "3": "RMSProp"
}

type OptimizerTypeUnion = `${OptimizerTypeEnum}`;

export type PublishedModel = {
  id: number;
  name: string;
  offChainId?: number;
  type: ModelTypeUnion;
  activationFunction: ActivationFunctionTypeUnion;
  optimizer: OptimizerTypeUnion;
  layers: number;
  feePerEpoch: number;
  epochs: number;
  status: "Waiting For Clients" | "Training" | "Completed";
}

export type TrainerModel = Omit<PublishedModel, "status"> & {
  status: "Available" | "Training" | "Completed";
};

export enum FilterModesEnum {
  All = "All",
  Training = "Training",
  Completed = "Completed",
  Waiting = "Waiting For Clients",
}
export type FilterModesUnion = `${FilterModesEnum}`;