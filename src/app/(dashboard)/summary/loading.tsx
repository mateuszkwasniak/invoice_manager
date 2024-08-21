import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <div className="min-w-[50%] flex flex-col gap-8">
        <Skeleton className="w-full h-[350px]" />
        <Skeleton className="w-full h-[350px]" />
        <Skeleton className="w-full h-[350px]" />
      </div>
    </main>
  );
}
