import { PublishedModel, TrainerModel } from "@/lib/types";

export const sampleModelData: PublishedModel[] = [
  {
    name: "Image Classifier",
    type: "CNN",
    activationFunction: "ReLU",
    optimizer: "Adam",
    layers: 5,
    feePerEpoch: 0.01,
    epochs: 10,
    status: "Waiting For Clients",
  },
  {
    name: "Text Generator",
    type: "RNN",
    activationFunction: "Tanh",
    optimizer: "SGD",
    layers: 3,
    feePerEpoch: 0.02,
    epochs: 20,
    status: "Completed",
  },
  {
    name: "Sentiment Analyzer",
    type: "LSTM",
    activationFunction: "Sigmoid",
    optimizer: "RMSProp",
    layers: 4,
    feePerEpoch: 0.015,
    epochs: 15,
    status: "Training",
  },
];

export const sampleTrainerModels: TrainerModel[] = [
    {
      name: "Image Classifier Pro",
      type: "CNN",
      activationFunction: "ReLU",
      optimizer: "Adam",
      layers: 5,
      feePerEpoch: 0.02,
      epochs: 10,
      status: "Training",
    },
    {
      name: "Text Generator v2",
      type: "RNN",
      activationFunction: "Tanh",
      optimizer: "SGD",
      layers: 4,
      feePerEpoch: 0.03,
      epochs: 20,
      status: "Available",
    },
    {
      name: "Sentiment Analyzer X",
      type: "LSTM",
      activationFunction: "Sigmoid",
      optimizer: "RMSProp",
      layers: 6,
      feePerEpoch: 0.015,
      epochs: 15,
      status: "Completed",
    },
  ];
