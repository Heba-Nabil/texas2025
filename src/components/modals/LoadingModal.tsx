import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { defaultLanguage } from "@/config";

export default function LoadingModal(props: { open: boolean; locale: string }) {
  const { open, locale = defaultLanguage } = props;

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-auto z-[100] w-auto gap-4 rounded-none bg-transparent shadow-none max-md:top-[50%] md:!translate-y-[-50%]"
        overLayClassName="bg-white/60 z-[100]"
      >
        <DialogHeader
          title="Toggle Loading Modal"
          className="sr-only hidden"
          showCloseBtn={false}
        />

        <DialogDescription className="sr-only hidden">
          Toggle Loading Modal
        </DialogDescription>

        <img
          src={
            locale === "ar"
              ? "/images/Texas-Icon-ar.gif"
              : "/images/Texas-Icon.gif"
          }
          alt="loading"
          width={112}
          height={112}
          className="size-28 object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
