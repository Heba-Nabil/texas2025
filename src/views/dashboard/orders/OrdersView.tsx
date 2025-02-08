"use client";

import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import OrderHistoryItem from "./OrderHistoryItem";
import EmptyOrders from "@/components/emptyStates/EmptyOrders";
// Types
import { SingleOrderResponseProps } from "@/types/api";
import { OrdersPageResourcesProps } from "@/types/resources";

type OrdersViewProps = {
  resources: OrdersPageResourcesProps;
  data?: SingleOrderResponseProps[] | null;
  locale: string;
};

function getCompletedOrders(data: SingleOrderResponseProps[]) {
  return data?.filter((item) =>
    item.TrackingStatus.every((status) => status.IsOn),
  );
}
function getCurrentOrders(data: SingleOrderResponseProps[]) {
  return data?.filter((item) =>
    item.TrackingStatus.some((status) => !status.IsOn),
  );
}

export default function OrdersView(props: OrdersViewProps) {
  const { data, resources, locale } = props;

  const pastOrders = data ? getCompletedOrders(data) : [];

  const currentOrders = data ? getCurrentOrders(data) : [];

  return (
    <DashBoardPagesWrapper>
      {data && data?.length > 0 ? (
        <div className="flex flex-grow overflow-y-auto px-5 max-lg:mt-6">
          <div className="w-full">
            {currentOrders?.length > 0 && (
              <div className="w-full">
                <h2 className="mb-4 font-biker text-xl font-bold capitalize">
                  {resources["currentOrders"]}
                </h2>

                <div className="group mb-1 w-full">
                  {currentOrders?.map((item) => (
                    <OrderHistoryItem
                      key={item?.ID}
                      data={item}
                      resources={resources}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastOrders?.length > 0 && (
              <>
                {currentOrders?.length > 0 && <hr className="my-6" />}

                <div className="w-full">
                  <h2 className="mb-4 font-biker text-xl font-bold capitalize">
                    {resources["pastOrders"]}
                  </h2>

                  <div className="group w-full">
                    {pastOrders?.map((item) => (
                      <OrderHistoryItem
                        key={item?.ID}
                        data={item}
                        resources={resources}
                        locale={locale}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <EmptyOrders
          resources={{
            orderNow: resources["orderNow"],
            noOrdersYet: resources["noOrdersYet"],
          }}
        />
      )}
    </DashBoardPagesWrapper>
  );
}
