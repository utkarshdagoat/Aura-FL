import { runtimeMethod, RuntimeModule, runtimeModule, state } from "@proto-kit/module";
import { State, StateMap } from "@proto-kit/protocol";
import { Bool, PublicKey, UInt64 } from "o1js";

type StakingRegistryConfig = Record<string, never>;


@runtimeModule()
export class StakingRegistry extends RuntimeModule<StakingRegistryConfig> {
    @state() public stakes = StateMap.from<PublicKey, UInt64>(PublicKey, UInt64);
    @state() public hasStaked = StateMap.from<PublicKey, Bool>(PublicKey, Bool);
    @state() public isSlashed = StateMap.from<PublicKey, Bool>(PublicKey, Bool);
    @state() public slashTreasury = State.from<PublicKey>(PublicKey);

    constructor (_slashTreasury: PublicKey) {
        super();
        this.slashTreasury.set(_slashTreasury); ;
    }

    @runtimeMethod()
    public async stake() {
        //TODO: check msg.value
    }

    @runtimeMethod()
    public async unstake(){
        //TODO: check msg.value
    }

    @runtimeMethod()
    public async slash(){

    }

    public async hasStakedAddress(address: PublicKey): Promise<Bool> {
        return (await this.hasStaked.get(address)).value;
    }

    public async getStakedAmount(address: PublicKey): Promise<UInt64> {
        return (await this.stakes.get(address)).value;
    }


    public async isNotSlashed(address: PublicKey): Promise<Bool> {
        return (await this.isSlashed.get(address)).value.not();
    }
}