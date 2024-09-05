import { Field } from "o1js";
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


export function conv2D(
    input: Array<Array<Array<Field>>>, 
    weights:Array<Array<Array<Array<Field>>>>, 
    bias: Array<Field>,
    kernelSize: number, 
    strides: number
): Array<Array<Array<Field>>> {
    const nRows = input.length;
    const nCols = input[0].length;
    const nChannels = input[0][0].length;
    const nFilters = weights[0][0][0].length;
    const outRows = Math.floor((nRows - kernelSize) / strides) + 1;
    const outCols = Math.floor((nCols - kernelSize) / strides) + 1;

    let output: Array<Array<Array<Field>>> = Array.from(Array(outRows), () =>
        Array.from(Array(outCols), () => Array(nFilters).fill(0))
    );

    for (let i = 0; i < outRows; i++) {
        for (let j = 0; j < outCols; j++) {
            for (let k = 0; k < nFilters; k++) {
                let sum = ZERO;
                for (let c = 0; c < nChannels; c++) {
                    let kernelProduct = [];
                    for (let x = 0; x < kernelSize; x++) {
                        let row = [];
                        for (let y = 0; y < kernelSize; y++) {
                            row.push(
                                input[i * (strides) + x][j * (strides) + y][c].mul(weights[x][y][c][k])
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

    return output;
}
