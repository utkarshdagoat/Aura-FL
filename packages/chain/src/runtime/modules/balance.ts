import { runtimeModule, state, runtimeMethod } from "@proto-kit/module";
import { State, assert } from "@proto-kit/protocol";
import { Balance, Balances as BaseBalances, TokenId, UInt, UInt64 } from "@proto-kit/library";
import { PublicKey } from "o1js";

interface BalancesConfig {
    totalSupply: Balance;
}

@runtimeModule()
export class BalancesWrapper extends BaseBalances<BalancesConfig> {
    @state() public circulatingSupply = State.from<Balance>(Balance);

    @runtimeMethod()
    public async addBalance(
        address: PublicKey,
        amount: Balance
    ): Promise<void> {
        const circulatingSupply = await this.circulatingSupply.get();
        const newCirculatingSupply = Balance.from(circulatingSupply.value).add(
            amount
        );
        assert(
            newCirculatingSupply.lessThanOrEqual(this.config.totalSupply),
            "Circulating supply would be higher than total supply"
        );
        await this.circulatingSupply.set(newCirculatingSupply);
        await this.mint(TokenId.from(0), address, amount);
    }

    @runtimeMethod()
    public async getBalanceRuntime(address: PublicKey): Promise<UInt64> {
        return await this.getBalance(TokenId.from(0), address);
    }
}