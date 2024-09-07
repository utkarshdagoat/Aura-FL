import { Provable, Struct, UInt32, ZkProgram } from "o1js";

type Arr = Array<UInt32>
type DoubleArr = Array<Array<UInt32>>
type TripleArr = Array<Array<Array<UInt32>>>
type QaudArr = Array<Array<Array<Array<UInt32>>>>
const ROWS = 6
const COLUMNS = 6
const NCHANNELS = 1;
const NFILTERS = 2;
const STRIDE = 1;
const KERNELSIZE = 3;
const OUTROWS = ROWS - KERNELSIZE + 1;
const OUTCOL = COLUMNS - KERNELSIZE + 1;
export class HeadLayerOutput extends Struct({
    output: Provable.Array(UInt32, OUTROWS * OUTCOL * NFILTERS)
}) { }

const ZERO = UInt32.from(0)

export async function headLayerInferece(
    input: Arr,
    weights: Arr,
    bias: Arr,
    out: Arr
): Promise<HeadLayerOutput> {
    let output = Array<UInt32>(OUTCOL * OUTROWS * NFILTERS).fill(ZERO);

    for (var i = 0; i < OUTROWS; i++) {
        for (var j = 0; j < OUTCOL; j++) {
            for (var f = 0; f < NFILTERS; f++) {
                let sum = bias[f];
                for (var ki = 0; ki < KERNELSIZE; ki++) {
                    for (var kj = 0; kj < KERNELSIZE; kj++) {
                        for (var c = 0; c < NCHANNELS; c++) {
                            sum.add(input[i + ki + j + kj + c].mul(weights[ki + kj + c + f]));
                        }
                    }
                }
                output[i + j + f] = sum;
                out[i + j + f].assertEquals(sum)
            }
        }
    }
    return new HeadLayerOutput({
        output: output
    })

}

export const headLayer = ZkProgram({
    publicOutput: HeadLayerOutput,
    name: "headLayer",
    methods: {
        headLayer: {
            privateInputs: [
                Provable.Array(UInt32, ROWS * COLUMNS * NCHANNELS),
                Provable.Array(UInt32, KERNELSIZE * KERNELSIZE * NCHANNELS * NFILTERS),
                Provable.Array(UInt32, NFILTERS),
                Provable.Array(UInt32, OUTROWS * OUTCOL * NFILTERS)
            ],
            method: headLayerInferece
        }
    }
})

export class HeadLayerProof extends ZkProgram.Proof(headLayer) { }