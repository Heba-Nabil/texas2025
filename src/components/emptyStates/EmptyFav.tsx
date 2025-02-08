import NextLink from "@/components/global/NextLink";
import { Button } from "@/components/ui/button";

type EmptyFavProps = {
  resources: {
    noFavourite: string;
    startExploring: string;
  };
};

export default function EmptyFav({ resources }: EmptyFavProps) {
  return (
    <div className="flex-center my-auto w-full flex-col gap-4 py-10">
      <img
        src="/images/icons/empty-fav.svg"
        alt="empty favourites"
        width={160}
        height={160}
        className="aspect-square max-w-full object-contain"
        loading="lazy"
      />

      <div className="mb-5 text-center">
        <h3 className="text-xl font-semibold">{resources["noFavourite"]}</h3>
      </div>

      <Button asChild>
        <NextLink href="/menu">{resources["startExploring"]}</NextLink>
      </Button>
    </div>
  );
}
