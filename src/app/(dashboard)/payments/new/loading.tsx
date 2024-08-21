import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <Skeleton className="w-1/4 h-8 mb-12" />
      <div className="w-full 2xl:w-[60%] flex gap-12">
        <div className="w-full flex flex-col gap-8">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-12" />
        </div>
        <div className="w-full flex flex-col gap-8">
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-40" />
        </div>
      </div>
    </main>
  );
}
