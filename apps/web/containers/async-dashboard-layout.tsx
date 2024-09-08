"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/lib/stores/wallet";
import { Separator } from "@/components/ui/separator";
import { useBalancesStore, useObserveBalance } from "@/lib/stores/balances";
import { useClientStore } from "@/lib/stores/client";
import { useObserverTasks } from "@/lib/stores/publisher";

interface navItem {
  name: string;
  link: string;
}

const AsyncDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems: navItem[] = [
    { name: "Publisher", link: "/dashboard/publisher" },
    { name: "Trainer", link: "/dashboard/trainer" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { wallet, connectWallet } = useWalletStore();
  const truncatedWallet = wallet?.slice(0, 6) + "..." + wallet?.slice(-6);
  const {balances,loadBalance } = useBalancesStore()
  const [balance, setBalance] = useState(0);
  useEffect(()=>{
    if(wallet){
      setBalance(Number(balances[wallet]))
    }
  },[wallet,balances])
  return (
    <>
      <div className="mx-auto h-screen pt-4 md:w-[72vw] xl:w-[60vw]">
        <header className="flex items-center justify-between bg-background py-1 shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-lg font-bold">AURA-FL</span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={activeIndex === index ? "linkActive" : "linkHover2"}
                  onClick={() => {
                    setActiveIndex(index);
                    router.push(item.link);
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>

          {wallet ? (
            <div className="flex flex-row gap-1">
              <span className="text-sm ">
                Balance : {balance} MINA
              </span>
              <Separator className="w-[2px]" orientation="vertical" />
              <span className="text-sm text-muted-foreground">{truncatedWallet}</span>
            </div>
          ) : (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          )}
        </header>
        <div className="mt-8 flex w-full flex-col gap-8">{children}</div>
      </div>
    </>
  );
};

export default AsyncDashboardLayout;

