// Types
import type { Metadata } from "next";

type SearchPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata(
  props: SearchPageProps,
): Promise<Metadata> {
  return {
    title: "Search",
  };
}

export default async function SearchPage(props: SearchPageProps) {
  const {
    params: { locale },
  } = props;

  return (
    <div className="py-10">
      <h1>Search Page Not in the current Milestone</h1>
    </div>
  );
}
