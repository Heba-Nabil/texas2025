import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedBannerPlaceholder() {
  return (
    <section className="w-full">
      <div className="container">
        <div className="flex w-full gap-3 overflow-hidden">
          {Array(8)
            .fill(null)
            ?.map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-video shrink-0 basis-[85%] rounded-lg sm:basis-3/4 md:basis-3/5 lg:basis-2/5 xl:basis-[30%]"
              />
            ))}
        </div>
      </div>
    </section>
  );
}
