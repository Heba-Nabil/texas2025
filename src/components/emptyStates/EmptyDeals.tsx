import NextLink from "../global/NextLink";
import { Button } from "../ui/button";

type EmptyDealsProps = {
  resources: {
    noDealsYet: string;
    startExploring: string;
  };
};

const EmptyDeals = (props: EmptyDealsProps) => {
  const { resources } = props;

  return (
    <div className="flex-center my-auto w-full flex-col gap-4 py-10">
      <img
        src="/images/icons/no-deals.svg"
        alt="empty orders"
        width={160}
        height={160}
        className="aspect-square max-w-full object-contain"
        loading="lazy"
      />

      <div className="mb-5 text-center">
        <h3 className="text-xl font-semibold">{resources["noDealsYet"]}</h3>
      </div>

      <Button asChild>
        <NextLink href="/menu" className="w-full sm:w-fit">
          Start Exploring
        </NextLink>
      </Button>
    </div>
  );
};

export default EmptyDeals;
