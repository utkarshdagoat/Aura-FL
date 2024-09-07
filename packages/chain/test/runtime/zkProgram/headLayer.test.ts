import "reflect-metadata"
import { UInt32, verify } from "o1js"
import { headLayer } from "../../../src/runtime/zkPrograms/headLayer"
import * as tf from "@tensorflow/tfjs"

describe("Head Layer test", () => {
    it("should compile", async () => {
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

        model.apply(tf.zeros([1, 6, 6, 1]));
        const convLayer = model.layers[0];
        const weights = convLayer.getWeights()
        const kernel = weights[0].arraySync();
        const bias = weights[1].arraySync();
        if (typeof kernel === 'number') return
        const kernelUInt32 = kernel.flat(3).map((value) => {
            if (typeof value === 'number') {
                return UInt32.from(Math.floor(Math.abs(value)))
            } else {
                return UInt32.from(0)
            }
        });
        console.log(kernelUInt32)
        if (typeof bias === 'number') return
        const biasUInt32 = bias.map((value) => {
            if (typeof value === 'number') {
                return UInt32.from(Math.floor(Math.abs(value)))
            } else {
                return UInt32.from(0)
            }
        });
        const inputTensor = tf.zeros([1, 6, 6, 1]);
        const input  = inputTensor.arraySync();
        if (typeof input === 'number') return;
        const inputUInt32 = input.flat(3).map((value) => {
            if (typeof value === 'number') {
                return UInt32.from(Math.floor(Math.abs(value)))
            } else {
                return UInt32.from(0)
            }
        })
        const convOutputTesnor = convLayer.apply(inputTensor) as tf.Tensor
        const convOutput = convOutputTesnor.arraySync() as number[][][][];
        const convOuputUint32 = convOutput[0].flat(2).map((value) => {
            if (typeof value === 'number') {
                return UInt32.from(Math.floor(Math.abs(value)))
            } else {
                return UInt32.from(0)
            }
        })

        const {verificationKey} = await headLayer.compile()
        const proof = await headLayer.headLayer(inputUInt32, kernelUInt32, biasUInt32,convOuputUint32)
        console.log(proof.toJSON())
        console.log(proof.verify())
        console.log(await verify(proof,verificationKey))
    }, 100000)
})