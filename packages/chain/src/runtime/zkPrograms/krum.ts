import { Bool, Provable, Struct, UInt32, ZkProgram } from "o1js";
export const NUM_OF_CLIENTS = 2;

/// ref: https://github.com/zk-bankai/zk-Krum

export class KrumPublicOutput extends Struct({
    output: Provable.Array(UInt32, NUM_OF_CLIENTS)
}) { }

const ZERO = UInt32.from(0)

type UInt32Array = Array<UInt32>;
export async function  krum(
    publicInput:UInt32,
    x: UInt32Array,
    y: UInt32Array,
): Promise<KrumPublicOutput> {
    const result = Array<UInt32>(NUM_OF_CLIENTS).fill(ZERO)
    const score = Array<UInt32>(NUM_OF_CLIENTS).fill(ZERO)

    for (let i = 0; i < NUM_OF_CLIENTS; i++) {
        score[i] = krumScore(x, y, i);
    }
    const meanScore = getMeanScore(score)
    const standardDev = getStandardDeviation(score)

    let bracketOne = ZERO
    let bracketTwo = ZERO
    for (let i = 0; i < NUM_OF_CLIENTS; i++) {
        let condition = (score[i].greaterThan(meanScore.sub(standardDev.div(2)))).and(score[i].lessThan(meanScore))
        bracketOne.add(Provable.if(condition, UInt32.from(1), ZERO))
        let conditionTwo = (score[i].greaterThan(meanScore)).and(score[i].lessThan(meanScore.add((standardDev.mul(3)).div(2))))
        bracketTwo.add(Provable.if(conditionTwo, UInt32.from(1), ZERO))
    }
    const badActors = bracketOne.greaterThan(bracketTwo)
    for (let i = 0; i < NUM_OF_CLIENTS; i++) {
        const condition = score[i].greaterThan(meanScore.add(publicInput.mul(standardDev))).and(badActors)
        result[i] = Provable.if(condition, UInt32.from(1), ZERO)
    }
    return new KrumPublicOutput({
        output: result
    })
}

export const Krum = ZkProgram({
    name:"Krum",
    publicInput:UInt32,
    publicOutput:KrumPublicOutput,
    methods:{
        krum:{
            privateInputs:[Provable.Array(UInt32,NUM_OF_CLIENTS),Provable.Array(UInt32,NUM_OF_CLIENTS)],
            method:krum
        }
    }
})

export class KrumProof extends ZkProgram.Proof(Krum) {}


function krumScore(
    x: UInt32Array,
    y: UInt32Array,
    i: number
): UInt32 {
    let paramScore = ZERO;
    for (let j = 0; j < NUM_OF_CLIENTS; j++) {
        const diffX = Provable.if(x[j].greaterThan(x[i]), x[j].sub(x[i]), x[i].sub(x[j]));
        const diffY = Provable.if(y[j].greaterThan(y[i]), y[j].sub(y[i]), y[i].sub(y[j]));
        paramScore.add(diffX.mul(diffX).add(diffY.mul(diffY)))
    }
    return paramScore;
}

function getMeanScore(score: UInt32Array): UInt32 {
    let meanScore = ZERO;
    for (let i = 0; i < NUM_OF_CLIENTS; i++) {
        meanScore.add(score[i])
    }
    meanScore = meanScore.div(NUM_OF_CLIENTS)
    return meanScore;
}

function getStandardDeviation(score: UInt32Array): UInt32 {
    const meanScore = getMeanScore(score)
    let standardDev = ZERO;
    for (let i = 0; i < NUM_OF_CLIENTS; i++) {
        let diff = Provable.if(score[i].greaterThan(meanScore), score[i].sub(meanScore), meanScore.sub(score[i]))
        standardDev.add(diff.mul(diff))
    }
    standardDev = standardDev.div(NUM_OF_CLIENTS)
    standardDev = Provable.if(standardDev.greaterThan(UInt32.from(1)), standardDev, UInt32.from(1));
    Provable.log(standardDev)
    standardDev = getSquareRoot(standardDev)
    return standardDev;
}

function getSquareRoot(x: UInt32): UInt32 {
    let a = x.div(2)
    let b = x.div(a)
    for (let i = 0; i < 3; i++) {
        a = (a.add(b)).div(2)
        b = x.div(a)
    }
    return a
}
