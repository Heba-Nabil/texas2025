import { useState } from "react";
import cn from "@/utils/cn";
import { formatDateTo24HourISO } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import RadioLabel from "@/components/ui/RadioLabel";

type SchedulePlanProps = {
  id: number;
  title: string;
};

type ScheduleOrderModalProps = {
  open: boolean;
  resources: {
    chooseTime: string;
    cancel: string;
    save: string;
    selectTimeFirst: string;
  };
  data: SchedulePlanProps[];
  scheduleDatePlan: number;
  scheduleTime: string;
  handleClose: () => void;
  setScheduleDatePlan: React.Dispatch<React.SetStateAction<number>>;
  setScheduleTime: React.Dispatch<React.SetStateAction<string>>;
  setOrderDate: React.Dispatch<React.SetStateAction<string>>;
};

export default function ScheduleOrderModal(props: ScheduleOrderModalProps) {
  const {
    open,
    resources,
    data,
    scheduleDatePlan,
    scheduleTime,
    handleClose,
    setScheduleDatePlan,
    setScheduleTime,
    setOrderDate,
  } = props;

  const [error, setError] = useState("");

  const handleSchedulePlanChange = (
    e: React.FormEvent<HTMLInputElement>,
    item: SchedulePlanProps,
  ) => {
    setError("");

    setScheduleDatePlan(item.id);
  };

  const handleScheduleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    setScheduleTime(e.target.value);
  };

  const handleSaveSchedule = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    setError("");

    if (!scheduleDatePlan || !scheduleTime) {
      return setError(resources["selectTimeFirst"]);
    }

    const timeToSave = new Date(),
      hours = Number(scheduleTime.split(":")[0]),
      minutes = Number(scheduleTime.split(":")[1]);

    if (scheduleDatePlan === 1) {
      timeToSave.setHours(hours, minutes);
    } else if (scheduleDatePlan === 2) {
      timeToSave.setDate(timeToSave.getDate() + 1);

      timeToSave.setHours(hours, minutes);
    }

    const formatTimeToSave = formatDateTo24HourISO(timeToSave);

    setOrderDate(formatTimeToSave);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader title={resources["chooseTime"]} />

        <DialogContentWrapper>
          <DialogDescription className="sr-only">
            {resources["chooseTime"]}
          </DialogDescription>

          <div className="flex w-full gap-3">
            {data?.map((item) => (
              <div key={item.id} className="w-full">
                <RadioLabel
                  name={`select_order_time_plan_${item.id}`}
                  id={`${item.title.toLowerCase().replace(/ /g, "_")}_${
                    item.id
                  }`}
                  checked={item.id === scheduleDatePlan}
                  onChange={(e) => handleSchedulePlanChange(e, item)}
                  className="h-full w-full"
                  labelClassName="h-full gap-2"
                >
                  <div className="relative w-full">
                    <div>
                      <span
                        className={cn(
                          "smooth block text-lg font-medium capitalize",
                          {
                            "text-main": item.id === scheduleDatePlan,
                          },
                        )}
                      >
                        {item.title}
                      </span>
                    </div>

                    {item.id === scheduleDatePlan && (
                      <input
                        type="time"
                        className="mt-1 w-full rounded bg-gray-200 px-1 py-1"
                        name={`${item.title}_selected_time`}
                        id={`${item.title}_selected_time`}
                        autoFocus={item.id === scheduleDatePlan}
                        onFocus={(e) => e.currentTarget.click()}
                        value={scheduleTime}
                        onChange={handleScheduleTimeChange}
                      />
                    )}
                  </div>
                </RadioLabel>
              </div>
            ))}
          </div>

          {error && <p className="mt-2 text-sm text-alt">{error}</p>}
        </DialogContentWrapper>

        <DialogFooter>
          <Button
            type="button"
            className="flex-1"
            variant="light"
            onClick={handleClose}
          >
            {resources["cancel"]}
          </Button>

          <Button type="button" className="flex-1" onClick={handleSaveSchedule}>
            {resources["save"]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
