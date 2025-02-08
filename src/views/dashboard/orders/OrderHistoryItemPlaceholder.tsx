import { Skeleton } from "@/components/ui/skeleton";

export default function OrderHistoryItemPlaceholder() {
  return (
    <div className="flex items-start gap-1 rounded-lg p-4 shadow-lg">
      <Skeleton className="h-10 w-8" />

      <div className="flex-grow p-2">
        <div className="flex flex-col">
          <div className="flex-between gap-1">
            <Skeleton className="h-10 w-full max-w-xs" />
          </div>

          <Skeleton className="h-10 w-20" />

          <div className="flex-between gap-2">
            <div className="space-y-1">
              <Skeleton className="h-2 w-20" />
              <Skeleton className="h-2 w-20" />
            </div>

            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="flex-between mt-1 gap-3 border-t border-gray-200 pt-3">
          <span className="flex-between gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-2 w-10" />
          </span>

          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
    </div>
  );
}
