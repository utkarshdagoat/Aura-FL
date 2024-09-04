import { runtimeMethod, RuntimeModule, runtimeModule, state } from "@proto-kit/module";
import { State, StateMap } from "@proto-kit/protocol";
import { Bool, PublicKey, UInt64 } from "o1js";

type StakingRegistryConfig = Record<string, never>;


@runtimeModule()
export class StakingRegistry extends RuntimeModule<StakingRegistryConfig> {
    @state() public stakes = StateMap.from<PublicKey, UInt64>(PublicKey, UInt64);
    @state() public hasStaked = StateMap.from<PublicKey, Bool>(PublicKey, Bool);
    @state() public isSlashed = StateMap.from<PublicKey, Bool>(PublicKey, Bool);
    @state() public slashTreasury = PublicKey;

    @runtimeMethod()
    public async stake() {
        //TODO: check msg.value
    }

}