import { Field, ZkProgram } from 'o1js';
import { mimcHashMatrix3D } from './commons/mimc3d';
import { conv2D } from './commons/conv2D';
import { relu } from './commons/relu';

async function _headLayer(
    nRows: Field,
    nCols: Field,
    nChannels: Field,
    nFilters: Field,
    kernelSize: Field,
    strides: Field,
    in_hash: Field,
    x: Field[][][]
  ): Promise<Field> {
    const nRowsBigInt = Number(nRows.toBigInt());
    const nColsBigInt = Number(nCols.toBigInt());
    const nChannelsBigInt = Number(nChannels.toBigInt());
    const nFiltersBigInt = Number(nFilters.toBigInt());
    const kernelSizeBigInt = Number(kernelSize.toBigInt());
    const stridesBigInt = Number(strides.toBigInt());

    const convLayerOutputRows = Math.floor((nRowsBigInt - kernelSizeBigInt) / stridesBigInt) + 1;
    const convLayerOutputCols = Math.floor((nColsBigInt - kernelSizeBigInt) / stridesBigInt) + 1;
    const convLayerOutputDepth = nFiltersBigInt;
    const scaleFactor = 10 ** 16;
  
    const inputHash = mimcHashMatrix3D(nRowsBigInt, nColsBigInt, nChannelsBigInt, x);
    if (!inputHash.equals(in_hash)) {
      throw new Error('Input hash does not match the expected hash.');
    }
  
    const W = Array(kernelSizeBigInt)
      .fill(null)
      .map(() =>
        Array(kernelSizeBigInt)
          .fill(null)
          .map(() =>
            Array(nChannelsBigInt).fill(Array(nFiltersBigInt).fill(Field(0)))
          )
      );
  
    const b = Array(nFilters).fill(Field(0));
    const convOutput = conv2D(x,W,b,kernelSizeBigInt,stridesBigInt);
    const activations = Array(convLayerOutputRows)
      .fill(null)
      .map(() =>
        Array(convLayerOutputCols)
          .fill(null)
          .map(() =>
            Array(convLayerOutputDepth).fill(Field(0))
          )
      );
  
    for (let row = 0; row < convLayerOutputRows; row++) {
      for (let col = 0; col < convLayerOutputCols; col++) {
        for (let depth = 0; depth < convLayerOutputDepth; depth++) {
          const reluOutput = relu(convOutput[row][col][depth]);
          activations[row][col][depth] = reluOutput.div(scaleFactor);
        }
      }
    }
  
    const outputHash = mimcHashMatrix3D(convLayerOutputRows, convLayerOutputCols, convLayerOutputDepth, activations);
  
    return outputHash;
}
  
export const headLayer = ZkProgram({
    name:"headlayer",
    publicOutput:Field,
    methods:{
        headLayer:{
            privateInputs:[
                Field,
                Field,
                Field,
                Field,
                Field,
                Field,
                Field,
                Array<Array<Array<Field>>>
            ],
            method:_headLayer
        }
    }
})
export class HeadLayerProof extends ZkProgram.Proof(headLayer){} 