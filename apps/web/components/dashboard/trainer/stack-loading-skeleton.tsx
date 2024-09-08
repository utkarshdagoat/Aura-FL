import { Skeleton } from "@/components/ui/skeleton";

export default function StackLoadingSkeleton() {
  return (
    <>
      {Array(8).map((_, index) => (
        <Skeleton key={index} className={`my-3 h-16 w-full`} />
      ))}
    </>
  );
}
