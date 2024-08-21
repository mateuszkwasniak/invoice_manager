import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <Skeleton className="w-full lg:w-[60%] h-[350px]" />
    </main>
  );
}
