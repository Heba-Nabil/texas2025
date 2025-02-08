import { Skeleton } from "@/components/ui/skeleton";

export default function WorldOfTexasPlaceholder() {
  return (
    <section className="mb-8 w-full">
      <div className="container">
        <div className="flex-between">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>

        <div className="mt-3 flex w-full gap-3 overflow-hidden">
          {Array(6)
            .fill(null)
            ?.map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-video shrink-0 basis-[70%] md:basis-3/5 lg:basis-2/5 xl:basis-[30%]"
              />
            ))}
        </div>
      </div>
    </section>
  );
}
