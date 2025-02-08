// Types
import { StoreFacilityProps } from "@/types/api";

type FacilitiesProps = {
  data: StoreFacilityProps[];
};

export default function Facilities(props: FacilitiesProps) {
  const { data } = props;

  return (
    <div className="mb-4 mt-2 flex flex-wrap gap-2">
      {data?.map((item, index) => (
        <div className="flex-center flex-col" key={index}>
          {item.IconURL?.trim() && (
            <img
              src={item.IconURL?.trim()}
              alt={item.Name?.trim()}
              className="w-7 object-contain"
              loading="lazy"
            />
          )}

          <span className="text-sm">{item.Name?.trim()}</span>
        </div>
      ))}
    </div>
  );
}
