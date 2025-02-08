import MealItemPlaceholder from "@/components/items/meal-item/MealItemPlaceholder";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopDealsPlaceholder() {
  return (
    <section className="mb-8 w-full">
      <div className="container">
        <div className="flex-between">
          <Skeleton className="h-10 w-full max-w-sm" />

          <Skeleton className="h-5 w-20" />
        </div>

        <div className="mb-4 mt-3 w-full @container">
          <div className="flex w-full gap-3 overflow-hidden pb-6">
            {Array(6)
              .fill(null)
              ?.map((_, index) => (
                <div
                  key={index}
                  className="shrink-0 basis-full @sm:basis-[70%] @sm:pt-24 @md:basis-1/2 @xl:basis-[35%] @3xl:basis-[30%] @5xl:basis-1/4 @7xl:basis-1/5"
                >
                  <MealItemPlaceholder />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
