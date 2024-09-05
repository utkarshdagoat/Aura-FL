function matElemSum(a: number[][]): number {
    const m = a.length;
    const n = a[0].length;
    let sum = 0;

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            sum += a[i][j];
        }
    }

    return sum;
}


function conv2D(
    input: number[][][], 
    weights: number[][][][], 
    bias: number[], 
    kernelSize: number, 
    strides: number
): number[][][] {
    const nRows = input.length;
    const nCols = input[0].length;
    const nChannels = input[0][0].length;
    const nFilters = weights[0][0][0].length;
    const outRows = Math.floor((nRows - kernelSize) / strides) + 1;
    const outCols = Math.floor((nCols - kernelSize) / strides) + 1;

    let output: number[][][] = Array.from(Array(outRows), () =>
        Array.from(Array(outCols), () => Array(nFilters).fill(0))
    );

    for (let i = 0; i < outRows; i++) {
        for (let j = 0; j < outCols; j++) {
            for (let k = 0; k < nFilters; k++) {
                let sum = 0;
                for (let c = 0; c < nChannels; c++) {
                    let kernelProduct = [];
                    for (let x = 0; x < kernelSize; x++) {
                        let row = [];
                        for (let y = 0; y < kernelSize; y++) {
                            row.push(
                                input[i * strides + x][j * strides + y][c] * weights[x][y][c][k]
                            );
                        }
                        kernelProduct.push(row);
                    }
                    sum += matElemSum(kernelProduct);
                }
                output[i][j][k] = sum + bias[k];
            }
        }
    }

    return output;
}
