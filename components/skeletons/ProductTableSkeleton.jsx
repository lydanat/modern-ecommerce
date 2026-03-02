import { Skeleton } from "@/components/ui/skeleton";

export default function ProductTableSkeleton({ rows = 5 }) {
  return (
    <div className="flex flex-col divide-y divide-neutral-50">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="w-10 h-12 rounded shrink-0" />
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-3 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-3 w-40 rounded-full flex-1" />
        </div>
      ))}
    </div>
  );
}