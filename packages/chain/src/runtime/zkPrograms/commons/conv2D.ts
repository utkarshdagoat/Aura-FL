import { UInt64 } from "o1js";
import { ZERO } from "../../modules/staking";

function matElemSum(a: Array<Array<UInt64>>): UInt64 {
    const m = a.length;
    const n = a[0].length;
    let sum = UInt64.from(0);

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            sum.add(a[i][j]);
        }
    }

    return sum;
}


export function conv2D(
    input: Array<Array<Array<UInt64>>>, 
    weights:Array<Array<Array<Array<UInt64>>>>, 
    bias: Array<UInt64>,
    kernelSize: UInt64, 
    strides:UInt64 
): Array<Array<Array<UInt64>>> {
    const nRows = input.length;
    const nCols = input[0].length;
    const nChannels = input[0][0].length;
    const nFilters = weights[0][0][0].length;
    const outRows = Math.floor((nRows - kernelSize.toJSON()) / strides.toJSON()) + 1;
    const outCols = Math.floor((nCols - kernelSize.toJSON()) / strides.toJSON()) + 1;

    let output: Array<Array<Array<UInt64>>> = Array.from(Array(outRows), () =>
        Array.from(Array(outCols), () => Array(nFilters).fill(0))
    );

    for (let i = 0; i < outRows; i++) {
        for (let j = 0; j < outCols; j++) {
            for (let k = 0; k < nFilters; k++) {
                let sum = ZERO;
                for (let c = 0; c < nChannels; c++) {
                    let kernelProduct = [];
                    for (let x = 0; x < kernelSize.toJSON(); x++) {
                        let row = [];
                        for (let y = 0; y < kernelSize.toJSON(); y++) {
                            row.push(
                                input[i * (strides.toJSON()) + x][j * (strides.toJSON()) + y][c].mul(weights[x][y][c][k])
                            );
                        }
                        kernelProduct.push(row);
                    }
                    sum.add(matElemSum(kernelProduct).toBigInt());
                }
                output[i][j][k] = UInt64.from(sum.add(bias[k].toBigInt()).toBigInt());
            }
        }
    }

    return output;
}
