import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import usePageModal from "@/hooks/usePageModal";
import cn from "@/utils/cn";
import NextImage from "@/components/global/NextImage";

type MenuItemHeaderProps = {
  isItemInDefault: boolean;
  handleReset: () => void;
  resources: {
    reset: string;
  };
  isNavFixed: boolean;
  data: {
    Name: string;
    IconURL: string;
  };
};

export default function MenuItemHeader(props: MenuItemHeaderProps) {
  const { isItemInDefault, handleReset, resources, isNavFixed, data } = props;

  const { handleModalDismiss } = usePageModal();

  return (
    <div className="relative rounded-t-3xl bg-white px-4 pb-1">
      <div className="flex-between pb-3 pt-6">
        <button
          type="button"
          aria-label="back"
          onClick={() => handleModalDismiss()}
        >
          <i className="flex-center size-9 rounded-full bg-gray-100">
            <ChevronLeftIcon className="size-4 shrink-0 rtl:-scale-x-100" />
          </i>
        </button>

        <button
          type="button"
          className="capitalize text-alt underline disabled:pointer-events-none disabled:opacity-50"
          disabled={isItemInDefault}
          onClick={handleReset}
        >
          {resources["reset"]}
        </button>
      </div>

      <div
        className={cn(
          "absolute -top-[130px] left-1/2 flex size-48 -translate-x-1/2",
          {
            "-top-[65px] size-28": isNavFixed,
          },
        )}
      >
        <NextImage
          src={data?.IconURL}
          alt={data?.Name}
          fill
          sizes="(max-media: 767px) 50vw, 25vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
