import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <div className="w-full 2xl:w-[75%]">
        <Skeleton className="w-full h-[466px]" />
      </div>
    </main>
  );
}
