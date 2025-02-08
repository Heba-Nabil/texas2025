"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import { useData } from "@/providers/DataProvider";
import useCountries from "@/hooks/useCountries";
import cn from "@/utils/cn";
import { displayInOrder } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RadioLabel from "@/components/ui/RadioLabel";

export default function ChangeCountryModal() {
  const t = useTranslations();
  const locale = useLocale();

  const {
    changeCountryModal: { isOpen },
  } = useAppSelector(getModals);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ changeCountryModal: { isOpen: false } }));
  };

  const { ID } = useData();
  const { data, isLoading } = useCountries(locale, true);

  const activeCountry = data?.find((item) => item.ID === ID);

  const [selectedCountry, setSelectedCountry] = useState(activeCountry);

  useEffect(() => {
    if (!selectedCountry) {
      setSelectedCountry(activeCountry);
    }
  }, [activeCountry, selectedCountry]);

  const handleConfirmChangeCountry = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedCountry?.ID === ID) {
      handleClose();
    } else {
      selectedCountry?.WebsiteURL &&
        (location.href = selectedCountry?.WebsiteURL);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader title={t("changeCountry")} />

        <DialogContentWrapper>
          <div className="flex-center w-full flex-col gap-1">
            <DialogDescription>{t("selectCountryToOrder")}</DialogDescription>

            <div className="mt-5 flex w-full flex-col gap-3">
              {isLoading ? (
                <p>Loading Countries...</p>
              ) : (
                displayInOrder(data!)
                  ?.filter((item) => item.NameUnique !== "ksa")
                  ?.map((item) => (
                    <RadioLabel
                      key={item.ID}
                      name={`select_order_country_${item.ID}`}
                      id={`${item.Name.toLowerCase().replace(/ /g, "_")}_${
                        item.ID
                      }`}
                      checked={item.ID === selectedCountry?.ID}
                      onChange={() => setSelectedCountry(item)}
                      className="size-full"
                      labelClassName="h-full"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.FlagURL}
                          alt={item.Name}
                          width={70}
                          height={70}
                          loading="lazy"
                          className="max-w-full shrink-0 object-contain p-3"
                        />
                        <span
                          className={cn(
                            "smooth block flex-grow text-lg font-medium capitalize",
                            {
                              "text-main": item.ID === selectedCountry?.ID,
                            },
                          )}
                        >
                          {item.Name}
                        </span>
                      </div>
                    </RadioLabel>
                  ))
              )}
            </div>
          </div>
        </DialogContentWrapper>

        <DialogFooter>
          <Button
            type="button"
            className="flex-1"
            variant="light"
            onClick={handleClose}
          >
            {t("cancel")}
          </Button>

          <Button
            type="button"
            className="flex-1"
            onClick={handleConfirmChangeCountry}
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
