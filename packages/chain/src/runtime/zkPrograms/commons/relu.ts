import { Field } from "o1js";
import { isPositive } from "./util";

export function relu(input: Field): Field {
    let positive = isPositive(input);
    return input.mul(positive.toField()); 
  }