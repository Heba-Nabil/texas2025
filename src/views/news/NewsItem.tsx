import { ChevronRightIcon } from "@heroicons/react/24/solid";
import NextLink from "@/components/global/NextLink";
import NextImage from "@/components/global/NextImage";
// Types
import { NewsPageResourcesProps } from "@/types/resources";
import { PageSectionContentType } from "@/types/api";

type NewsItemProps = {
  data: PageSectionContentType;
  resources: NewsPageResourcesProps;
};

export default function NewsItem(props: NewsItemProps) {
  const { data, resources } = props;

  return (
    <div
      style={{ order: data.Order }}
      className="group overflow-hidden rounded-xl shadow-xl"
    >
      <div className="md:flex">
        {data.ImageUrl && (
          <NextLink
            href={`/news/${data.UniqueName}`}
            className="relative flex h-44 w-full flex-shrink-0 overflow-hidden rounded-xl md:w-56"
          >
            <NextImage
              src={data?.ImageUrl}
              alt={data?.Name}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="rounded-xl object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </NextLink>
        )}

        <div className="mt-4 grow px-4 pb-5 md:ms-6 md:mt-0 md:px-0 md:pb-2">
          {data.Link1 && <span className="text-gray-400">{data?.Link1}</span>}
          {data.Name && (
            <NextLink href={`/news/${data.UniqueName}`}>
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 md:line-clamp-1">
                {data?.Name}
              </h3>
            </NextLink>
          )}

          {data.DescriptionShort && (
            <p className="mt-3 line-clamp-2 text-gray-600">
              {data?.DescriptionShort}
            </p>
          )}

          <NextLink
            href={`/news/${data.UniqueName}`}
            className="mt-4 inline-flex items-center gap-x-1 font-medium text-accent decoration-2 hover:underline"
          >
            {resources["readMore"]}

            <ChevronRightIcon className="size-4 flex-shrink-0 rtl:-scale-x-100" />
          </NextLink>
        </div>
      </div>
    </div>
  );
}
