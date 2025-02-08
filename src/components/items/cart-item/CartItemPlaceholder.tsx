export default function CartItemPlaceholder() {
  return (
    <div role="presentation" className="animate-pulse mb-2">
      <div className="w-full group">
        <div className="p-1.5 gap-5 relative rounded-lg bg-white shadow-lg smooth hover:shadow-xl flex">
          <div className="@lg:mb-2">
            <div className="flex-center @lg:aspect-square bg-slate-200 w-[180px] @lg:w-[100px] overflow-hidden h-full @lg:h-auto"></div>
          </div>

          <div className="p-2 @lg:p-0 flex-grow">
            <div className="@lg:h-[70px] flex flex-col">
              <div className="h-5 bg-slate-200 rounded mb-1"></div>

              <div className="h-3 bg-slate-200 rounded max-w-[120px] mb-1"></div>

              <div className="h-2 bg-slate-200 rounded mb-0.5"></div>
              <div className="h-2 bg-slate-200 rounded mb-0.5"></div>
              <div className="h-2 bg-slate-200 rounded mb-0.5"></div>

              <div className="h-3 bg-slate-200 rounded max-w-[150px]"></div>
            </div>

            <div className="flex-between gap-3 mt-1">
              <div className="h-6 bg-slate-200 rounded w-[80px]"></div>

              <div className="h-10 bg-slate-200 rounded w-[100px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
