import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <div className="w-full 2xl:w-3/4 flex gap-2 flex-col items-center">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>
    </main>
  );
}
