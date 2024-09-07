import { TokenId, UInt64 } from "@proto-kit/library";
import { runtimeMethod, RuntimeModule, runtimeModule, state } from "@proto-kit/module";
import { assert, State, StateMap } from "@proto-kit/protocol";
import { Bool, PublicKey } from "o1js";
import { inject } from "tsyringe";
import {Balances} from "./balance";
export const TOKEN = TokenId.from(0);
export const ZERO = UInt64.from(0);
import { KrumProof } from "../zkPrograms/krum";

interface StakingRegistryConfig {
    slashTreasury: PublicKey;
    admin: PublicKey;
}

@runtimeModule()
export class StakingRegistry extends RuntimeModule<StakingRegistryConfig> {
    @state() public stakes = StateMap.from<PublicKey, UInt64>(PublicKey, UInt64);
    @state() public hasStaked = StateMap.from<PublicKey, Bool>(PublicKey, Bool);
    @state() public isSlashed = StateMap.from<PublicKey, Bool>(PublicKey, Bool);
    @state() public slashTreasury = State.from<PublicKey>(PublicKey);
    @state() public ADMIN = State.from<PublicKey>(PublicKey);

    constructor(
        @inject("Balances") public balance: Balances,
    ) {
        super();
    }

    @runtimeMethod()
    public async stake(amount: UInt64) {
        const slashTreasuryAddress = (await this.slashTreasury.get()).value;
        await this.balance.transfer(
            TokenId.from(0),
            this.transaction.sender.value,
            slashTreasuryAddress,
            amount
        );
        await this.stakes.set(this.transaction.sender.value, amount);
        await this.hasStaked.set(this.transaction.sender.value, Bool.fromValue(true));
    }

    @runtimeMethod()
    public async unstake() {
        const amount = await this.stakes.get(this.transaction.sender.value);
        const hasBeenSlashed = await this.isSlashed.get(this.transaction.sender.value);
        assert(hasBeenSlashed.value, "You have been slashed");
        assert(amount.value.greaterThan(ZERO), "You have not staked any amount");

        await this.balance.transfer(
            TOKEN,
            (await this.slashTreasury.get()).value,
            this.transaction.sender.value,
            amount.value
        );
        await this.stakes.set(this.transaction.sender.value,ZERO);
        await this.hasStaked.set(this.transaction.sender.value, Bool.fromValue(false));
    }

    @runtimeMethod()
    public async slash(proof: KrumProof) {
        proof.verify()
        const amount = await this.stakes.get(this.transaction.sender.value);
        const hasBeenSlashed = await this.isSlashed.get(this.transaction.sender.value);
        assert(hasBeenSlashed.value.not(), "You have been slashed");
        assert(amount.value.greaterThan(ZERO), "You have not staked any amount");
        await this.stakes.set(this.transaction.sender.value, ZERO);
        await this.isSlashed.set(this.transaction.sender.value, Bool.fromValue(true));
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