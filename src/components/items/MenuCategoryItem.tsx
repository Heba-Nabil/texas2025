import NextImage from "@/components/global/NextImage";
import NextLink from "@/components/global/NextLink";
import cn from "@/utils/cn";
// Types
import { MenuCategoryProps } from "@/types/api";

type MenuCategoryItemProps = {
  data: MenuCategoryProps;
  className?: string;
};

export default function MenuCategoryItem({
  data,
  className,
}: MenuCategoryItemProps) {
  return (
    <NextLink
      href={`/menu/${data?.ID}`}
      className={cn(
        "flex-center smooth size-full flex-col gap-1 rounded-lg bg-gray-100 p-1 pb-2 text-center shadow hover:text-alt hover:shadow-lg lg:rounded-3xl",
        className,
      )}
    >
      {data?.IconURL && (
        <NextImage
          src={data?.IconURL}
          alt={data?.Name}
          width={200}
          height={200}
          className="relative -mt-[55px] object-contain lg:-mt-[100px]"
        />
      )}

      {data?.Name && (
        <span className="text-sm font-semibold capitalize leading-tight">
          {data?.Name}
        </span>
      )}
    </NextLink>
  );
}
