import { Balance, VanillaRuntimeModules,Balances } from "@proto-kit/library";
import { ModulesConfig } from "@proto-kit/common";


export const modules = VanillaRuntimeModules.with({
  Balances,
});

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
};

export default {
  modules,
  config,
};
