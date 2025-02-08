import { Skeleton } from "@/components/ui/skeleton";

export default function BestSellerPlaceholder() {
  return (
    <section className="w-full">
      <div className="container">
        <div className="flex-between">
          <Skeleton className="h-10 w-full max-w-sm" />

          <Skeleton className="h-5 w-20" />
        </div>

        <div className="mt-3 flex w-full gap-3 overflow-hidden">
          {Array(6)
            .fill(null)
            ?.map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-[1/1.5] shrink-0 basis-[35%] rounded-lg sm:basis-[30%] lg:basis-[22%] xl:basis-[19%]"
              />
            ))}
        </div>
      </div>
    </section>
  );
}
