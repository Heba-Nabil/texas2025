// Types
import type { Metadata } from "next";

type FavouritesPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata(
  props: FavouritesPageProps,
): Promise<Metadata> {
  return {
    title: "Favourites",
  };
}

export default async function FavouritesPage(props: FavouritesPageProps) {
  const {
    params: { locale },
  } = props;

  return (
    <div className="py-10">
      <h1>Favourites Page Not in the current Milestone</h1>
    </div>
  );
}
