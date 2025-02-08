import { Dispatch, memo, SetStateAction, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/solid";
import { useData } from "@/providers/DataProvider";
import { elementsIds } from "@/utils/constants";
import {
  findById,
  formatDateInMonthDayTime,
  formatDateTo24HourISO,
} from "@/utils";
import cn from "@/utils/cn";
import ScheduleOrderModal from "./ScheduleOrderModal";
import { CheckoutResponseProps } from "@/types/api";
import { Button } from "@/components/ui/button";

type OrderDateStepProps = {
  locale: string;
  resources: {
    orderTime: string;
    orderNow: string;
    scheduleOrder: string;
    scheduleOrderDesc: string;
    chooseTime: string;
    cancel: string;
    save: string;
    today: string;
    tomorrow: string;
    selectTimeFirst: string;
    change: string;
    time: string;
    at: string;
  };
  orderDate: string;
  orderDateError: string;
  currentDate: Date;
  setOrderDate: React.Dispatch<React.SetStateAction<string>>;
  setOrderDateError: React.Dispatch<React.SetStateAction<string>>;
  setUseCurrentTime: React.Dispatch<React.SetStateAction<boolean>>;
  handleRollBack: () => Promise<void | CheckoutResponseProps | null>;
  checkoutResponse: CheckoutResponseProps | null;
  setCheckoutResponse: Dispatch<SetStateAction<CheckoutResponseProps | null>>;
  useCurrentTime: boolean;
  orderTypeID: string | undefined;
  orderTimePlan: number | null;
  setOrderTimePlan: React.Dispatch<React.SetStateAction<number | null>>;
};

type PlanProps = {
  id: number;
  title: string;
  description: string;
};

function OrderDateStep(props: OrderDateStepProps) {
  const {
    locale,
    resources,
    orderDate,
    orderDateError,
    currentDate,
    setOrderDate,
    setOrderDateError,
    setUseCurrentTime,
    checkoutResponse,
    handleRollBack,
    setCheckoutResponse,
    useCurrentTime,
    orderTypeID,
    orderTimePlan,
    setOrderTimePlan,
  } = props;
  const { OrderTypes } = useData();

  const plans: PlanProps[] = [
    {
      id: 1,
      title: resources["orderNow"],
      description: formatDateInMonthDayTime(currentDate, locale),
    },
    {
      id: 2,
      title: resources["scheduleOrder"],
      description: resources["scheduleOrderDesc"],
    },
  ];

  const schedulePlans = [
    {
      id: 1,
      title: resources["today"],
    },
    {
      id: 2,
      title: resources["tomorrow"],
    },
  ];

  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [scheduleDatePlan, setScheduleDatePlan] = useState(0);
  const [scheduleTime, setScheduleTime] = useState("");

  const handlePlanChange = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    plan: PlanProps,
  ) => {
    setOrderDateError("");

    if (plan.id === 1) {
      const formatTimeToSave = formatDateTo24HourISO(new Date());
      setOrderDate(formatTimeToSave);

      setScheduleDatePlan(0);
      setScheduleTime("");
    } else {
      setOrderDate("");
      setOpenScheduleModal(true);
    }

    setUseCurrentTime(plan.id === 1);
    setOrderTimePlan(plan.id);
  };

  const handleCloseScheduleModal = () => {
    if (orderTimePlan !== 1 && (!scheduleDatePlan || !scheduleTime)) {
      setOrderTimePlan(null);
      setUseCurrentTime(false);
    }
    setOpenScheduleModal(false);
  };

  const handleOrderDateSelect = async () => {
    if (checkoutResponse?.OrderNumber) {
      await handleRollBack();
      setCheckoutResponse(null);
    }
  };

  const selectedOrderType = findById(OrderTypes, orderTypeID!);

  const nowMessage = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    // hour: "numeric",
  });

  return (
    <div className="my-4" id={elementsIds.orderDateWrapper}>
      <div className="mb-4 flex items-center gap-2">
        <ClockIcon className="size-7 shrink-0" />

        <div className="flex-between my-4 w-full gap-1">
          <div>
            <h2 className="text-xl font-semibold capitalize">
              {selectedOrderType?.Name} {resources["time"]}
            </h2>

            {checkoutResponse?.OrderNumber && orderDate && (
              <p>
                <span className="font-semibold capitalize">
                  {useCurrentTime
                    ? resources["orderNow"]
                    : resources["orderTime"]}{" "}
                </span>
                {resources["at"]}{" "}
                {useCurrentTime
                  ? nowMessage
                  : formatDateInMonthDayTime(orderDate)}
              </p>
            )}
          </div>
          {checkoutResponse?.OrderNumber && orderDate && (
            <Button variant="dark" onClick={handleOrderDateSelect}>
              {resources["change"]}
            </Button>
          )}
        </div>
      </div>
      {(!checkoutResponse?.OrderNumber || !orderDate) && (
        <>
          <ul className="flex flex-col gap-3 sm:flex-row">
            {plans.map((item) => (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  className={cn(
                    "smooth group flex h-full w-full cursor-pointer items-center rounded-lg border-2 border-gray-200 p-4 hover:bg-[#fffcf5]",
                    {
                      "border-main bg-[#fffcf5]": item.id === orderTimePlan,
                    },
                  )}
                  onClick={(e) => handlePlanChange(e, item)}
                >
                  <div className="flex-grow text-start">
                    <span
                      className={cn(
                        "smooth block text-lg font-medium capitalize",
                        {
                          "text-main": item.id === orderTimePlan,
                        },
                      )}
                    >
                      {item.title}
                    </span>

                    {orderTimePlan === item.id &&
                    orderDate &&
                    scheduleDatePlan &&
                    scheduleTime ? (
                      <span>
                        {schedulePlans[scheduleDatePlan - 1].title}:{" "}
                        {formatDateInMonthDayTime(orderDate, locale)}
                      </span>
                    ) : (
                      <span>{item.description}</span>
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex-center smooth aspect-square w-6 rounded-full border border-gray-200",
                      { "border-none bg-main": item.id === orderTimePlan },
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={cn("size-4 fill-current text-white", {
                        hidden: item.id !== orderTimePlan,
                        block: item.id === orderTimePlan,
                      })}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {orderDateError && (
            <p className="mt-1 text-sm text-alt">{orderDateError}</p>
          )}

          {openScheduleModal && (
            <ScheduleOrderModal
              open={openScheduleModal}
              resources={{
                chooseTime: resources["chooseTime"],
                cancel: resources["cancel"],
                save: resources["save"],
                selectTimeFirst: resources["selectTimeFirst"],
              }}
              data={schedulePlans}
              scheduleDatePlan={scheduleDatePlan}
              scheduleTime={scheduleTime}
              handleClose={handleCloseScheduleModal}
              setScheduleDatePlan={setScheduleDatePlan}
              setScheduleTime={setScheduleTime}
              setOrderDate={setOrderDate}
            />
          )}
        </>
      )}
    </div>
  );
}

export default memo(OrderDateStep);
