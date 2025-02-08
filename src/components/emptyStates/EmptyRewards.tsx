import NextLink from "@/components/global/NextLink";
import { Button } from "@/components/ui/button";

type EmptyRewardsProps = {
  resources: {
    emptyRewardsTitle: string;
    emptyRewardsDesc: string;
    orderNow: string;
  };
};

const EmptyRewards = (props: EmptyRewardsProps) => {
  const { resources } = props;

  return (
    <div className="flex-center my-auto w-full flex-col gap-4 py-10">
      <img
        src="/images/icons/empty-rewards.svg"
        alt="empty orders"
        width={160}
        height={160}
        className="aspect-square max-w-full object-contain"
        loading="lazy"
      />

      <div className="mb-3 text-center">
        <h3 className="text-xl font-semibold">
          {resources["emptyRewardsTitle"]}
        </h3>
      </div>

      <p className="mb-5 text-base capitalize">
        {resources["emptyRewardsDesc"]}
      </p>

      <Button asChild>
        <NextLink href="/menu" className="w-full sm:w-fit">
          {resources["orderNow"]}
        </NextLink>
      </Button>
    </div>
  );
};

export default EmptyRewards;
