import { Field } from 'o1js';
import { mimcSponge } from './mimcsponge';


export function mimcHashMatrix3D(
    rows: number,
    cols: number,
    depth: number,
    matrix: Field[][][],
): Field {
    const inputs: Field[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            for (let dep = 0; dep < depth; dep++) {
                inputs.push(matrix[row][col][dep]);
            }
        }
    }

    const nInputs = inputs.length;
    const nOutputs = 1;
    const k = Field(0);

    const result = mimcSponge(nInputs, nOutputs, k, inputs, 91);
    return result[0];
}

export function mimcHashMatrix4D(
    rows: number,
    cols: number,
    depth: number,
    dim4length: number,
    matrix: Field[][][][],
): Field {
    const inputs: Field[] = [];


    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            for (let dep = 0; dep < depth; dep++) {
                for (let d4 = 0; d4 < dim4length; d4++) {
                    inputs.push(matrix[row][col][dep][d4]);
                }
            }
        }
    }


    const nInputs = inputs.length;
    const nOutputs = 1;
    const k = Field(0);

    const result = mimcSponge(nInputs, nOutputs, k, inputs, 91);
    return result[0];
}