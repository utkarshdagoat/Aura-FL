import { headLayerProgram } from "../../../src/runtime/zkPrograms/head";
describe("proof should be generated",()=>{
    it("Should compile", async () =>{
        const {verificationKey} = await headLayerProgram.compile()
        console.log(verificationKey)
    },100000)
},)