import { Button } from "@/components/ui/button";
import NextLink from "@/components/global/NextLink";
// Types
import { NotFoundPageResourcesProps } from "@/types/resources";

export default function NotFoundView({
  resources,
}: {
  resources: NotFoundPageResourcesProps;
}) {
  return (
    <div className="flex-center w-full text-center">
      <div className="container py-10">
        <img
          src="/images/icons/404.svg"
          alt="not found"
          width={300}
          height={300}
          className="mx-auto max-w-full object-contain"
        />

        <p className="mt-3 text-3xl text-dark dark:text-gray-400">
          {resources["someThingWentWrong"]}
        </p>

        <p className="text-xl text-gray-600 dark:text-gray-400">
          {resources["couldNotFindThisPage"]}
        </p>

        <div className="flex-center mt-5 flex-col gap-2 sm:flex-row sm:gap-3">
          <Button asChild>
            <NextLink href="/">{resources["backToHome"]}</NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
