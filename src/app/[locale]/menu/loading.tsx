import MealItemPlaceholder from "@/components/items/meal-item/MealItemPlaceholder";

export default function MenuLoading() {
  return (
    <div className="w-full">
      <div className="flex-between gap-3">
        <div className="h-6 w-full max-w-xs rounded bg-slate-200" />
      </div>

      <div className="mt-5 @container/main min-[476px]:mt-24">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4 @container @md/main:gap-y-24">
          {Array(8)
            .fill(null)
            ?.map((_, index) => (
              <div
                key={index}
                className="col-span-full @md:col-span-6 @2xl:col-span-4"
              >
                <MealItemPlaceholder />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
