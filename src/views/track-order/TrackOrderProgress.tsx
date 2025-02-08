import cn from "@/utils/cn";
// Types
import { TrackingStatusProps } from "@/types/api";

type TrackOrderProgressProps = {
  data: TrackingStatusProps[];
  resources: {
    trackOrder: string;
  };
};

export default function TrackOrderProgress(props: TrackOrderProgressProps) {
  const { resources, data } = props;

  const activeStatus = data?.filter((item) => item?.IsOn).length;
  const activeTrackLength = (activeStatus / data?.length) * 100;

  return (
    <div className="flex flex-col">
      <div className="text-xl font-semibold capitalize">
        <span className="flex items-center gap-2">
          <img
            src="/images/icons/track.svg"
            alt="track"
            width={25}
            height={25}
            loading="lazy"
            className="smooth object-contain"
          />
          {resources["trackOrder"]}
        </span>
      </div>

      <div className="relative mt-4">
        <div className="absolute inset-x-[25px] top-[35%] h-1 rounded-full bg-gray-200">
          <div
            className="absolute h-1 rounded-full bg-main ltr:left-0 rtl:right-0"
            style={{ width: `${activeTrackLength}%` }}
          />
        </div>

        <ul className="flex-between">
          {data?.map((item, index) => (
            <li
              key={index}
              className={cn("flex-center relative flex-col text-center", {
                grayscale: !item?.IsOn,
              })}
            >
              <span className="flex-center aspect-square shrink-0">
                <img
                  src={item?.StatusIcon}
                  alt={item?.Name}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="smooth aspect-square w-10 object-contain @sm:w-12 @md:w-16"
                />
              </span>

              <span className="text-sm capitalize sm:text-base">
                {item?.Name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
