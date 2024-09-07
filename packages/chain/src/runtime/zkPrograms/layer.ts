import { ZkProgram } from "o1js";
import { HeadLayerProof } from "./headLayer";
export const layer = ZkProgram({
    name:"Layer",
    methods:{
        layer:{
            privateInputs:[
                HeadLayerProof
            ],
            async method(headProof){
                headProof.verify();
            }
        }
    }
})
export class LayerProof extends ZkProgram.Proof(layer) {}