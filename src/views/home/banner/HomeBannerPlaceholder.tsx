import { Skeleton } from "@/components/ui/skeleton";

export default function HomeBannerPlaceholder() {
  return (
    <section className="mt-4 w-full">
      <div className="container">
        <div className="flex gap-3 overflow-hidden">
          {Array(8)
            .fill(null)
            ?.map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-[2.5/1] w-4/5 shrink-0 rounded-lg lg:w-3/5 lg:rounded-3xl"
              />
            ))}
        </div>
      </div>
    </section>
  );
}
