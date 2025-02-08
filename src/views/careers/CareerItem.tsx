import { ChevronRightIcon } from "@heroicons/react/24/solid";
import NextLink from "@/components/global/NextLink";
// Types
import { CareersItemType } from "@/types/api";

type Props = { data: CareersItemType };

export default function CareerItem(props: Props) {
  const { data } = props;

  return (
    <NextLink
      className="smooth group rounded-xl border bg-white shadow-sm hover:shadow-md"
      href={`/careers/${data.UniqueCode}`}
    >
      <div className="flex-between p-4">
        <div className="flex-grow">
          {data.Title && (
            <h3 className="smooth font-semibold text-gray-800 group-hover:text-accent">
              {data.Title}
            </h3>
          )}
          {data.DescriptionShort && (
            <p className="text-sm text-gray-500">{data.DescriptionShort}</p>
          )}
        </div>

        <ChevronRightIcon className="smooth size-5 shrink-0 group-hover:text-accent rtl:-scale-x-100" />
      </div>
    </NextLink>
  );
}
