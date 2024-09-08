import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/stores/dashboard";
import { useStake } from "@/lib/stores/staking";
import { Info } from "lucide-react";

export default function StakeAlert() {
  const { setHasTrainerStaked } = useDashboardStore();
  const stakingAmount = 100;
  const stake = useStake()
  
  return (
    <div className="flex w-full flex-row items-center gap-4 rounded-md border-l border-theme_purple p-4">
      <span className="inline-flex gap-2 items-center">
        <Info className="h-6 w-6" />
        You need to stake{" "}
        <span className="underline-theme font-bold">
          {stakingAmount} MINA
        </span>{" "}
        to continue.
      </span>
      <Button
        variant={"shine"}
        className="rounded-full"
        size={"sm"}
        onClick={()=>stake(stakingAmount)}
      >
        Stake Now
      </Button>
    </div>
  );
}
