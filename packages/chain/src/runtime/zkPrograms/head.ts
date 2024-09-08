// import { Field, Provable, ZkProgram } from 'o1js';
// import { mimcHashMatrix3D } from './commons/mimc3d';
// import { conv2D } from './commons/conv2D';
// import { relu } from './commons/relu';

// async function headLayer(
//     nFilters: number,
//     kernelSize: number,
//     strides: number,
//     in_hash: Field,
//     x: Array<Array<Array<Field>>>
// ): Promise<Field> {
//     const nRows = x.length;
//     const nCols = x[0].length;
//     const nChannels = x[0][0].length;


//     const convLayerOutputRows = Math.floor((nRows - kernelSize) / strides) + 1;
//     const convLayerOutputCols = Math.floor((nCols - kernelSize) / strides) + 1;
//     const convLayerOutputDepth = nFilters;
//     const scaleFactor = 10 ** 16;
//     const inputHash = mimcHashMatrix3D(nRows, nCols, nChannels, x);
//     if (!inputHash.equals(in_hash)) {
//         throw new Error('Input hash does not match the expected hash.');
//     }

//     const W = Array(kernelSize)
//         .fill(null)
//         .map(() =>
//             Array(kernelSize)
//                 .fill(null)
//                 .map(() =>
//                     Array(nChannels).fill(Array(nFilters).fill(Field(0)))
//                 )
//         );

//     const b = Array(nFilters).fill(Field(0));
//     const convOutput =await conv2D(x, W, b, Field.from(kernelSize), Field.from(strides));
//     const activations = Array(convLayerOutputRows)
//         .fill(null)
//         .map(() =>
//             Array(convLayerOutputCols)
//                 .fill(null)
//                 .map(() =>
//                     Array(convLayerOutputDepth).fill(Field(0))
//                 )
//         );

//     for (let row = 0; row < convLayerOutputRows; row++) {
//         for (let col = 0; col < convLayerOutputCols; col++) {
//             for (let depth = 0; depth < convLayerOutputDepth; depth++) {
//                 const reluOutput = relu(convOutput[row][col][depth]);
//                 activations[row][col][depth] = reluOutput.div(scaleFactor);
//             }
//         }
//     }

//     const outputHash = mimcHashMatrix3D(convLayerOutputRows, convLayerOutputCols, convLayerOutputDepth, activations);
//     return outputHash;
// }

// export const headLayerProgram = ZkProgram({
//     name: "headlayer",
//     publicOutput: Field,
//     // publicInput:Field,
//     methods: {
//         headLayer: {
//             privateInputs: [Provable.Array(Provable.Array(Provable.Array(Field, 28), 28), 1), Field],
//             async method(x, in_hash): Promise<Field> {
//                 const res = (await headLayer(
//                     2,
//                     3,
//                     1,
//                     in_hash,
//                     x
//                 ));
//                 return res

//             }
//         }
//     }
// })
// export class HeadLayerProof extends ZkProgram.Proof(headLayerProgram) { } 