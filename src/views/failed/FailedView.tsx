import NextLink from "@/components/global/NextLink";
import { Button } from "@/components/ui/button";
// Types
import { OrderFailedPageResourcesProps } from "@/types/resources";

type FailedViewProps = {
  resources: OrderFailedPageResourcesProps;
};

export default function FailedView({ resources }: FailedViewProps) {
  return (
    <div className="flex-center w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="flex-center flex-col gap-y-4 rounded-lg bg-white px-5 py-10 text-center">
          <h1 className="text-3xl font-bold uppercase sm:text-6xl rtl:text-4xl rtl:sm:text-6xl">
            {resources["orderFailed"]}
          </h1>

          <p className="text-lg text-dark-gray rtl:text-xl">
            {resources["orderFailedDesc"]}
          </p>

          <Button asChild>
            <NextLink href="/menu">{resources["viewMenu"]}</NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
