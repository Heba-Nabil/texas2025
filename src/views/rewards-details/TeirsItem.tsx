import NextImage from "@/components/global/NextImage";
// Types
import { PageSectionContentType } from "@/types/api";

type TeirsItemProps = {
  data: PageSectionContentType;
};

export default function TeirsItem({ data }: TeirsItemProps) {
  return (
    <li className="flex flex-col items-center justify-center">
      {data.ImageUrl && (
        <div className="mb-2 flex">
          <NextImage
            src={data?.ImageUrl}
            alt={data?.Name}
            width={170}
            height={170}
            className="object-contain"
          />
        </div>
      )}

      <h6 className="text-center font-bold uppercase">
        {data?.Name}
        <br />
        <span className="uppercase text-alt">{data?.DescriptionShort}</span>
      </h6>

      {data.DescriptionLong && (
        <div
          className="mb-0 text-center uppercase"
          dangerouslySetInnerHTML={{ __html: data.DescriptionLong }}
        />
      )}
    </li>
  );
}
