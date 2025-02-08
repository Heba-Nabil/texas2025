import { Skeleton } from "@/components/ui/skeleton";
import QRPlaceholder from "./QRPlaceholder";

export default function AppsSectionPlaceholder() {
  return (
    <section className="mb-8 mt-16 bg-alt">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block">
            <Skeleton className="size-full object-contain" />
          </div>

          <div className="flex-center flex-col gap-3 py-14 text-center">
            <Skeleton className="h-10 w-full max-w-xs" />

            <QRPlaceholder />

            <div className="flex-center gap-4">
              {[1, 2]?.map((_, index) => (
                <Skeleton key={index} className="h-10 w-32 max-w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
