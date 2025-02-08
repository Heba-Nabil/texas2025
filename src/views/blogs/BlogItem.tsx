import NextImage from "@/components/global/NextImage";
import NextLink from "@/components/global/NextLink";
import { Button } from "@/components/ui/button";
// Types
import { PageSectionContentType } from "@/types/api";
import { BlogsPageResourcesProps } from "@/types/resources";

type BlogsItemProps = {
  data: PageSectionContentType;
  resources: BlogsPageResourcesProps;
};

export default async function BlogItem(props: BlogsItemProps) {
  const { data, resources } = props;

  return (
    <div
      style={{ order: data.Order }}
      className="group overflow-hidden rounded-lg shadow-xl"
    >
      {data.ImageUrl && (
        <NextLink
          href={`/blogs/${data.UniqueName}`}
          className="relative mb-3 block h-[270px] w-full overflow-hidden"
        >
          <NextImage
            src={data?.ImageUrl}
            alt={data?.Name}
            width={200}
            height={200}
            className="smooth h-full w-full object-cover group-hover:scale-105"
          />
        </NextLink>
      )}

      <div className="p-4">
        {data?.Link1 && <span className="text-alt">{data?.Link1}</span>}
        {data?.Name && (
          <NextLink href={`/blogs/${data.UniqueName}`}>
            <h3 className="line-clamp-1 text-xl font-semibold capitalize">
              {data?.Name}
            </h3>
          </NextLink>
        )}

        {data.DescriptionShort && (
          <p className="text-md mb-3 mt-1 line-clamp-2">
            {data?.DescriptionShort}
          </p>
        )}

        <Button variant="dark" asChild>
          <NextLink href={`/blogs/${data.UniqueName}`} className="w-[120px]">
            {resources["readMore"]}
          </NextLink>
        </Button>
      </div>
    </div>
  );
}
