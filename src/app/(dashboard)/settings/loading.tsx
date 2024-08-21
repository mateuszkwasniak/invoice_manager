import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <div className="min-w-[33%] flex flex-col gap-4">
        <Skeleton className="w-1/2 h-12" />
        <Skeleton className="w-full h-[250px]" />
      </div>
    </main>
  );
}
