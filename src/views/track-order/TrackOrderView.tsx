"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect } from "react";
import { useRouter } from "@/navigation";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { deleteServerCookie } from "@/server/actions/serverCookie";
import { clearServerCookie } from "@/server/actions/clearCookies";
import { BILL_LINE } from "@/utils/constants";
import { displayInOrder } from "@/utils";
import { getGuestSession } from "@/utils/getSessionHandler";
import { useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import PageHeader from "@/components/global/PageHeader";
import SuccessSection from "./SuccessSection";
import TrackOrderProgress from "./TrackOrderProgress";
import TrackOrderPayment from "./TrackOrderPayment";
import EarnedPoints from "./EarnedPoints";
import RatingSection from "./RatingSection";
import TrackOrderSummary from "./TrackOrderSummary";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { Skeleton } from "@/components/ui/skeleton";
// Types
import { SingleOrderResponseProps } from "@/types/api";
import { TrackOrderResourcesProps } from "@/types/resources";

const DynamicTrackOrderType = dynamic(() => import("./TrackOrderType"), {
  ssr: false,
  loading: () => <Skeleton className="h-24 w-full" />,
});

type TrackOrderViewProps = {
  isAccessTokenExpired: boolean;
  data?: SingleOrderResponseProps | null;
  resources: TrackOrderResourcesProps;
  orderNumber: string;
  locale: string;
};

export default function TrackOrderView(props: TrackOrderViewProps) {
  const { isAccessTokenExpired, resources, data, orderNumber, locale } = props;

  const clearSession = useCallback(async () => {
    await clearServerCookie();

    window.location.replace(`/${locale}`);
  }, [locale]);

  useEffect(() => {
    if (isAccessTokenExpired) {
      clearSession();
    }
  });

  const router = useRouter();

  const session = useAppSelector(getClientSession);

  useEffect(() => {
    deleteServerCookie([BILL_LINE]);
  }, []);

  useEffect(() => {
    const guestSession = getGuestSession();

    if (session?.isGuest && guestSession === null && !isAccessTokenExpired) {
      router.push("/");
    }
  }, [session, router, isAccessTokenExpired]);

  if (!data) return null;

  return (
    <div className="flex w-full flex-col bg-gray-100">
      <div className="container flex-grow py-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-full lg:col-span-8">
            <div className="rounded-lg bg-white p-4">
              <PageHeader
                title={`${resources["thankYou"]} ${data?.ApplicationUserInformation?.Name}!`}
                titleClassName="font-texas text-2xl"
              >
                <p className="flex shrink-0 items-center gap-1 text-slate-500">
                  {resources["orderNo"]}:{" "}
                  <span className="font-semibold text-accent">
                    {orderNumber}
                  </span>
                </p>
              </PageHeader>

              <div className="border-b-2 py-5">
                <SuccessSection
                  resources={{
                    orderSubmitSuccess: resources["orderSubmitSuccess"],
                    phone: resources["phone"],
                    recieveEmailMsg: resources["recieveEmailMsg"],
                    at: resources["at"],
                  }}
                  data={{
                    Email: data?.ApplicationUserInformation?.Email,
                    Phone: data?.ApplicationUserInformation?.Phone,
                  }}
                />

                {data?.Note && (
                  <div className="mt-2">
                    <FloatingLabelInput
                      id="notes"
                      type="text"
                      label={resources["addInstructionsOptional"]}
                      startIcon={
                        <ClipboardDocumentIcon
                          className={defaultStartInputIconClassNames()}
                        />
                      }
                      aria-disabled={true}
                      disabled={true}
                      readOnly={true}
                      defaultValue={data?.Note}
                    />
                  </div>
                )}
              </div>

              {data?.TrackingStatus?.length > 0 && (
                <div className="border-b-2 py-5 @container">
                  <TrackOrderProgress
                    data={displayInOrder(data?.TrackingStatus)}
                    resources={{ trackOrder: resources["trackOrder"] }}
                  />
                </div>
              )}

              <div className="border-b-2 py-5">
                <DynamicTrackOrderType
                  locale={locale}
                  orderTypeData={data?.OrderType}
                  storeData={data?.Store}
                  applicationUser={data?.ApplicationUserInformation}
                  date={data?.OrderDate}
                  resources={{ orderDate: resources["orderDate"] }}
                />
              </div>

              <div className="border-b-2 py-5">
                <TrackOrderPayment
                  data={data?.Payments}
                  resources={{ paymentMethod: resources["paymentMethod"] }}
                />
              </div>

              {data?.Points > 0 && (
                <div className="border-b-2 py-5">
                  <EarnedPoints
                    points={data?.Points}
                    resources={{ earnedPoints: resources["earnedPoints"] }}
                  />
                </div>
              )}

              <div className="mt-5">
                <RatingSection
                  resources={resources}
                  orderNumber={orderNumber}
                  rate={data?.Rate}
                  locale={locale}
                />
              </div>
            </div>
          </div>

          <div className="col-span-full lg:col-span-4">
            <TrackOrderSummary
              data={data}
              resources={{
                exploreMenu: resources["exploreMenu"],
                orderSummary: resources["orderSummary"],
                total: resources["total"],
                deliveryFees: resources["deliveryFees"],
                discount: resources["discount"],
                subTotal: resources["subTotal"],
                tax: resources["tax"],
                item: resources["items"],
                items: resources["items"],
                notAvailable: resources["notAvailable"],
                promoCodeDiscount: resources["promoCodeDiscount"],
                dealsDiscount: resources["dealsDiscount"],
                allPricesAreVatInclusive: resources["allPricesAreVatInclusive"],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
