export default function MealItemPlaceholder() {
  return (
    <div role="presentation" className="animate-pulse">
      <div className="group w-full">
        <div className="me-5 flex w-full shrink-0 rounded-2xl bg-white p-0.5 shadow-lg hover:shadow-xl @md:flex-col @md:rounded-3xl">
          <div className="relative mx-auto aspect-square size-48 max-w-full rounded-2xl bg-slate-200 @md:-mt-16 @md:size-3/4 @md:rounded-3xl" />

          <div className="mt-0 flex w-full flex-grow flex-col p-2 md:w-auto">
            <div className="flex flex-col gap-1">
              <div className="h-2 w-3/4 rounded bg-slate-200" />

              <div className="h-1 w-full rounded bg-slate-200" />
              <div className="h-1 w-full rounded bg-slate-200" />

              <div className="my-2 flex gap-1">
                <div className="h-5 min-w-14 rounded-sm bg-slate-200" />
                <div className="h-5 min-w-14 rounded-sm bg-slate-200" />
                <div className="h-5 min-w-14 rounded-sm bg-slate-200" />
              </div>

              <div className="h-3 w-2/5 rounded bg-slate-200" />
            </div>

            <div className="flex-between mt-2 gap-3 py-1.5">
              <strong className="h-5 w-1/4 rounded bg-slate-200" />

              <div className="h-10 w-[120px] shrink-0 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
