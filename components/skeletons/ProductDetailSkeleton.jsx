import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Image area */}
      <div className="flex flex-row gap-2">
        <Skeleton className="flex-1 aspect-3/4" />
        <div className="hidden sm:flex flex-col gap-2 w-18">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="flex-1" />
          ))}
        </div>
      </div>
      {/* Details area */}
      <div className="flex flex-col gap-6 lg:pt-2">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-10 w-3/4 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-5/6 rounded-full" />
          <Skeleton className="h-3 w-4/6 rounded-full" />
        </div>
      </div>
    </div>
  );
}