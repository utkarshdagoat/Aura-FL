import {Krum} from "../../../src/runtime/zkPrograms/krum"

describe("KRUM Function Test",()=>{
    it("should compile",async ()=>{
        const {verificationKey} =await Krum.compile() 
        // console.log(verificationKey)
    },100000)
})