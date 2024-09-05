import { Field,  Bool } from 'o1js';


function num2Bits(input: Field): Bool[] {
  let bits: Bool[] = [];
  let binaryRepresentation = input.toBits(256); 
  for (let i = 0; i < 256; i++) {
    bits.push(binaryRepresentation[i]);
  }
  return bits;
}

function sign(bits: Bool[]): Bool {
  let isNegative = bits[255].equals(Bool(true)); 
  return isNegative; 
}


export function isPositive(input: Field): Bool {
  let bits = num2Bits(input);
  let isNegative = sign(bits);
  return isNegative.not();
}
