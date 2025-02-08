"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type LockedDealModalProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LockedDealModal({
  isOpen,
  setOpen,
}: LockedDealModalProps) {
  const t = useTranslations();

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const handleReadMore = () => {
    router.push("/rewards-details");

    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader />

        <DialogContentWrapper>
          <div className="flex-center w-full flex-col gap-5 text-center">
            <img
              src="/images/icons/locked-deal-with-circle.svg"
              width={128}
              height={128}
              alt="locked"
              loading="lazy"
              className="size-32 max-w-full object-contain"
            />

            <div>
              <h2 className="text-xl font-semibold text-alt">
                {t("thisDealIsLocked")}
              </h2>

              <DialogDescription className="max-w-xs text-lg font-semibold leading-tight">
                {t("rewardsWillBeAvailableOnceYouEarnMorePoints")}
              </DialogDescription>
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

          <Button type="button" className="flex-1" onClick={handleReadMore}>
            {t("learnMore")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
