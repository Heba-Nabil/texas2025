"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Types
import { StoreProps } from "@/types/api";

type BusyStoreModalProps = {
  open: boolean;
  toggleBusyStore: (data: StoreProps | null) => void;
  data: StoreProps | null;
  cb: (value: boolean) => void;
};

export default function BusyStoreModal(props: BusyStoreModalProps) {
  const { open, toggleBusyStore, data, cb } = props;

  const t = useTranslations();

  const handleConfirm = () => {
    cb && cb(data ? data.IfItBusyIsItAvailable : false);

    toggleBusyStore(null);
  };

  return (
    <Dialog open={open} onOpenChange={() => toggleBusyStore(null)}>
      <DialogContent>
        <DialogHeader title={t("busyStore")} />

        <DialogContentWrapper>
          <DialogDescription className="text-center">
            {data?.IsItBusyMessage}
          </DialogDescription>
        </DialogContentWrapper>

        <DialogFooter>
          <Button type="button" className="flex-1" onClick={handleConfirm}>
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
