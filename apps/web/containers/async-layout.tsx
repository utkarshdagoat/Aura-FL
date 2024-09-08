import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { useVerificationStatusObserver } from "@/lib/stores/aggregate";
import { useBalancesStore, useObserveBalance } from "@/lib/stores/balances";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useObserverTasks } from "@/lib/stores/publisher";
import { useStakingStatusObserver } from "@/lib/stores/staking";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { ReactNode, useEffect, useMemo } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {
  const wallet = useWalletStore();
  const client = useClientStore();
  const chain = useChainStore();
  const balances = useBalancesStore();

  usePollBlockHeight();
  useObserveBalance();
  useNotifyTransactions();
  useStakingStatusObserver()
  useEffect(() => {
    client.start();
  }, []);

  useEffect(() => {
    wallet.initializeWallet();
    wallet.observeWalletChange();
  }, []);

  const loading = useMemo(
    () => client.loading || balances.loading,
    [client.loading, balances.loading],
  );

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
