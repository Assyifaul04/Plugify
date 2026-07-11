import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-muted/50 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-8 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl bg-muted/50 p-5">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-48 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}