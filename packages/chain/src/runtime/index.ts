import { Balance, VanillaRuntimeModules,Balances } from "@proto-kit/library";
import { ModulesConfig } from "@proto-kit/common";
import { Publisher } from "./modules/publish";
import { StakingRegistry } from "./modules/staking";
import { Aggregator } from "./modules/aggregator";
import { PrivateKey } from "o1js";


export const modules = VanillaRuntimeModules.with({
  Balances,
  Publisher,
  StakingRegistry,
  Aggregator
});
const privatKey = PrivateKey.random()
const addressPublisher = privatKey.toPublicKey()

const adminKey = PrivateKey.random()
const addressAdmin = adminKey.toPublicKey()

const slashingKey = PrivateKey.random()
const addressSlashing = slashingKey.toPublicKey()


export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
  Publisher: {
    address:addressPublisher
  },
  StakingRegistry: {
    admin: addressAdmin,
    slashTreasury: addressSlashing
  },
  Aggregator: {}
};

export default {
  modules,
  config,
};
