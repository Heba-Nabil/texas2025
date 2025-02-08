import { Skeleton } from "@/components/ui/skeleton";
import OrderHistoryItemPlaceholder from "@/views/dashboard/orders/OrderHistoryItemPlaceholder";

export default function OrderAgainPlaceholder() {
  return (
    <section className="mb-5 w-full">
      <div className="container">
        <div className="flex-between">
          <Skeleton className="h-10 w-full max-w-sm" />

          <Skeleton className="h-5 w-20" />
        </div>

        <div className="mt-3 flex w-full gap-3 overflow-hidden pb-3">
          {Array(5)
            .fill(null)
            ?.map((_, index) => (
              <div
                key={index}
                className="shrink-0 basis-[85%] sm:basis-3/4 md:basis-3/5 lg:basis-2/5 xl:basis-[30%]"
              >
                <OrderHistoryItemPlaceholder />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
