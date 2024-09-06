import { Field, Provable, Struct, ZkProgram } from "o1js";
import { ZERO } from "../../modules/staking";

function matElemSum(a: Array<Array<Field>>): Field {
    const m = a.length;
    const n = a[0].length;
    let sum = Field.from(0);

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            sum.add(a[i][j]);
        }
    }
    return sum;
}
export class Conv2DPublicOutput extends Struct({
    output: Provable.Array(Provable.Array(Provable.Array(Field, 28), 28), 1)
}) { }

export async function conv2D(
    input: Array<Array<Array<Field>>>,
    weights: Array<Array<Array<Array<Field>>>>,
    bias: Array<Field>,
    kernelSize: Field,
    strides: Field,
): Promise<Conv2DPublicOutput> {
    const nRows = input.length;
    const nCols = input[0].length;
    const nChannels = input[0][0].length;
    const nFilters = weights[0][0][0].length;
    const kernelSizeInt = Number(kernelSize.toBigInt());
    const stridesInt = Number(strides.toBigInt());
    const outRows = Math.floor((nRows - kernelSizeInt) / stridesInt) + 1;
    const outCols = Math.floor((nCols - kernelSizeInt) / stridesInt) + 1;

    let output: Array<Array<Array<Field>>> = Array.from(Array(outRows), () =>
        Array.from(Array(outCols), () => Array(nFilters).fill(0))
    );

    for (let i = 0; i < outRows; i++) {
        for (let j = 0; j < outCols; j++) {
            for (let k = 0; k < nFilters; k++) {
                let sum = ZERO;
                for (let c = 0; c < nChannels; c++) {
                    let kernelProduct = [];
                    for (let x = 0; x < kernelSizeInt; x++) {
                        let row = [];
                        for (let y = 0; y < kernelSizeInt; y++) {
                            row.push(
                                input[i * (stridesInt) + x][j * (stridesInt) + y][c].mul(weights[x][y][c][k])
                            );
                        }
                        kernelProduct.push(row);
                    }
                    sum.add(matElemSum(kernelProduct).toBigInt());
                }
                output[i][j][k] = Field.from(sum.add(bias[k].toBigInt()).toBigInt());
            }
        }
    }
    return new Conv2DPublicOutput({
        output: output
    });
};


// export const conv2DProgram = ZkProgram({
//     publicOutput: Conv2DPublicOutput,
//     methods:{
//         conv2D:{
//             privateInputs: [
//                 Provable.Array(Provable.Array(Provable.Array(Field, 28), 28), 1), 
//                 Provable.Array(Provable.Array(Provable.Array(Provable.Array(Field, 28), 28), 3), 3), 
//                 Provable.Array(Field, 3), 
//                 Field, 
//                 Field
//             ],
//             async method(
//                 input, 
//                 weights , 
//                 bias, 
//                 kernelSize, 
//                 strides
//             ): Promise<Conv2DPublicOutput>{
//                 const res =  await conv2D(input, weights, bias, kernelSize, strides);
//                 return res
//             }
//         }
//     }
// })

