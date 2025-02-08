import NextLink from "@/components/global/NextLink";

type CartItemImageProps = {
  data: {
    CategoryNameUnique: string;
    LineID: string;
    IsCustomizable: boolean;
    ID: string;
    Name: string;
    NameUnique: string;
    IconURL: string;
  };
};

export default function CartItemImage({ data }: CartItemImageProps) {
  return (
    <div className="relative flex h-full w-[80px] shrink-0 items-center justify-center rounded-[15px] bg-slate-100 @md:w-[140px] @lg:mb-2 md:rounded-[0px]">
      {data?.IsCustomizable ? (
        <NextLink
          href={`/menu/${data?.CategoryNameUnique}/${data?.NameUnique}?cid=${data?.LineID}`}
          aria-label={data?.Name}
          className="flex-center relative w-full overflow-hidden bg-slate-100"
          scroll={false}
        >
          <img
            src={data?.IconURL}
            alt="meal"
            width={200}
            height={200}
            className="smooth max-w-full object-contain"
          />
        </NextLink>
      ) : (
        <div className="flex-center relative w-full overflow-hidden bg-slate-100">
          <img
            src={data?.IconURL}
            alt="meal"
            width={200}
            height={200}
            className="smooth max-w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
