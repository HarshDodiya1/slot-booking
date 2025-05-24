import { Skeleton } from "@/components/ui/skeleton";

export function SlotSkeleton() {
  // Create an array of hours from 8 AM to 8 PM
  const hours = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="space-y-6">
      {hours.map((hour) => (
        <div key={hour} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array.from({ length: 2 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function VenueSelectorSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[60px] w-full" />
    </div>
  );
}