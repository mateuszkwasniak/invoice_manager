import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <Skeleton className="w-full 2xl:w-[50%] h-[50vh]" />
    </main>
  );
}
