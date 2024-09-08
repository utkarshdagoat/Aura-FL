import * as tf from '@tensorflow/tfjs';
import {  UInt32, verify } from 'o1js';
import { headLayer } from "chain/src/runtime/zkPrograms/headLayer"
import { HeadLayerProof } from 'chain/dist/runtime/zkPrograms/headLayer';
import axios from 'axios';
import { ADD_WEIGHTS_BIASES } from './backend';

interface ProcessedData {
    kernelBigInt: number[];
    biasBigInt: number[];
    inputBigInt: number[];
    convOutputBigInt: number[];
}

export async function trainAndGenerateProof(wallet:string,task:number) : Promise<HeadLayerProof> {
    console.log("called")
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
        inputShape: [6, 6, 1],
        filters: 2,
        kernelSize: 3,
        strides: 1,
        activation: 'relu'
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });

    const inputTensor = tf.randomUniform([1, 6, 6, 1], -1, 1);
    const input = inputTensor.arraySync() as number[][][][];

    const convLayer = model.layers[0];
    const weights = convLayer.getWeights();
    const kernel = weights[0].arraySync() as number[][][][];
    const bias = weights[1].arraySync() as number[];
    console.log("Kernel", kernel)
    console.log("Bias", bias)
    const kernelBigInt = kernel.flat(3).map((value) => {
        return (Math.floor(Math.abs(value)));
    });
    const kernelUInt32 = kernel.flat(3).map((value) => {
        if (typeof value === 'number') {
            return UInt32.from(Math.floor(Math.abs(value)))
        } else {
            return UInt32.from(0)
        }
    });

    console.log("Kernel Uint32", kernelUInt32)

    const biasBigInt = bias.map((value) => {
        return (Math.floor(Math.abs(value)));
    });
    const biasUInt32 = bias.map((value) => {
        if (typeof value === 'number') {
            return UInt32.from(Math.floor(Math.abs(value)))
        } else {
            return UInt32.from(0)
        }
    });
    console.log("Bias Uint32", biasUInt32)
    const inputBigInt = input.flat(3).map((value) => {
        return (Math.floor(Math.abs(value)));
    });
    const inputUInt32 = input.flat(3).map((value) => {
        if (typeof value === 'number') {
            return UInt32.from(Math.floor(Math.abs(value)))
        } else {
            return UInt32.from(0)
        }
    })

    console.log("Input Uint32", inputUInt32)
    const convOutputTensor = convLayer.apply(inputTensor) as tf.Tensor;
    const convOutput = convOutputTensor.arraySync() as number[][][][];
    const convOuputUint32 = convOutput[0].flat(2).map((value) => {
        if (typeof value === 'number') {
            return UInt32.from(Math.floor(Math.abs(value)))
        } else {
            return UInt32.from(0)
        }
    })
    const convOutputBigInt = convOutput[0].flat(2).map((value) => {
        return (Math.floor(Math.abs(value)));
    });

    const { verificationKey } = await headLayer.compile()
    console.log("Verification Key", verificationKey)
    const proof = await headLayer.headLayer(inputUInt32, kernelUInt32, biasUInt32, convOuputUint32)
    console.log(proof)
    if (!verify(proof, verificationKey))
        throw new Error("Proof verification failed someone has tampered with the data");
    const processedData: ProcessedData = {
        kernelBigInt,
        biasBigInt,
        inputBigInt,
        convOutputBigInt
    };
    const res = await axios.post(ADD_WEIGHTS_BIASES(task,wallet),{
        weights:kernelBigInt,
        bias:biasBigInt
    },{
        withCredentials:true,
    })
    console.log(res.data)

    

    const blob = new Blob([JSON.stringify(proof.toJSON())], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proof.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return proof
}

