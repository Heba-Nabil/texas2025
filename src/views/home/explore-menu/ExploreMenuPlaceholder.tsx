import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreMenuPlaceholder() {
  return (
    <section className="w-full">
      <div className="container">
        <div className="flex-between">
          <Skeleton className="h-10 w-full max-w-sm" />

          <Skeleton className="h-5 w-20" />
        </div>

        <div className="mt-7 flex w-full gap-3 overflow-hidden">
          {Array(10)
            .fill(null)
            ?.map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-square shrink-0 basis-[30%] rounded-lg sm:basis-[23%] md:basis-[19%] lg:basis-[15%] lg:rounded-3xl xl:basis-[12%]"
              />
            ))}
        </div>
      </div>
    </section>
  );
}
