"use client";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/lib/stores/wallet";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import "reflect-metadata";

export default function LandingPage() {
  const { connectWallet, wallet } = useWalletStore();
  const router = useRouter();
  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <div className="gradient-theme absolute -top-[20%] left-0 -z-10 h-80 w-full overflow-x-hidden bg-gradient-to-br opacity-60 blur-[400px] lg:h-[36vh] " />
      <div className="flex flex-col items-center gap-4">
        <h1 className="gradient-theme bg-gradient-to-tr bg-clip-text text-8xl font-bold text-transparent">
          AURA-FL
        </h1>
        <p className="text-xl text-muted-foreground">
          Adaptive Unified Resource Architecture for Federated Learning
        </p>
        {wallet ? (
          <Button
            className="mt-4 rounded-full px-8 py-6 text-lg"
            variant={"shine"}
            onClick={() => router.push("/dashboard/publisher")}
          >
            Get Started
          </Button>
        ) : (
          <Button
            className="gradient-metal mt-4 rounded-full border bg-gradient-to-tr px-8 py-6 text-lg"
            variant={"expandIcon"}
            iconPlacement="right"
            Icon={MoveRight}
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}
