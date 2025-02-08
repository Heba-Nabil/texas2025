import { formatDateInMonthDayTime } from "@/utils";
import NextImage from "@/components/global/NextImage";
// Types
import {
  ApplicationUserProps,
  StoreProps,
  TrackOrderTypesProps,
} from "@/types/api";

type TrackOrderTypsProps = {
  orderTypeData: TrackOrderTypesProps;
  storeData: StoreProps;
  applicationUser: ApplicationUserProps;
  date: string;
  resources: { orderDate: string };
  locale: string;
};

export default function TrackOrderType(props: TrackOrderTypsProps) {
  const { orderTypeData, storeData, date, resources, applicationUser, locale } =
    props;

  const orderDate = formatDateInMonthDayTime(date, locale);

  const isDelivery = !orderTypeData?.IsStoreDependent;

  const address = isDelivery
    ? `${applicationUser?.Apartment} - ${applicationUser?.Floor} - ${applicationUser?.Building} ${applicationUser?.Block} - ${applicationUser?.Street} - ${applicationUser?.Landmark}`
    : `${storeData?.Address}, ${storeData?.Name}`;

  const Longitude = isDelivery
    ? applicationUser.Longitude
    : storeData?.Longitude;
  const Latitude = isDelivery ? applicationUser.Latitude : storeData?.Latitude;

  return (
    <div className="flex-between w-full gap-3">
      <div className="flex gap-3">
        <NextImage
          src={orderTypeData?.IconURL}
          alt={orderTypeData?.Name}
          width={50}
          height={50}
          className="smooth size-14 rounded-full border-2 border-main"
        />

        <div className="flex-grow">
          <h3 className="text-xl font-semibold capitalize">
            {orderTypeData?.Name}
          </h3>

          <span className="my-0.5 block text-sm font-normal leading-tight">
            {address}
          </span>

          <p className="flex items-center gap-1 font-semibold">
            {resources["orderDate"]} :
            <span className="block text-sm">{orderDate}</span>
          </p>
        </div>
      </div>

      {Longitude && Latitude && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${Latitude},${Longitude}`}
          target="_blank"
          className="shrink-0 rtl:-scale-x-100"
        >
          <img
            src="/images/icons/map-location.svg"
            alt={orderTypeData?.Name}
            width={30}
            height={30}
            className="smooth border-main"
          />
        </a>
      )}
    </div>
  );
}
