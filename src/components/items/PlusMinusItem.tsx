import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import cn from "@/utils/cn";
import { Button } from "@/components/ui/button";

type PlusMinusItemProps = {
  className?: string;
  minusProps: React.HTMLAttributes<HTMLButtonElement>;
  minusIcon?: React.ReactNode;
  quantity: number;
  plusProps: React.HTMLAttributes<HTMLButtonElement>;
};

export default function PlusMinusItem(props: PlusMinusItemProps) {
  const {
    className,
    minusProps,
    minusIcon = <MinusIcon className="size-5 shrink-0" />,
    quantity,
    plusProps,
  } = props;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex-between w-full">
        <Button type="button" size="icon" variant="light" {...minusProps}>
          {minusIcon}
        </Button>

        <span className="h-full flex-grow text-center font-bold">
          {quantity}
        </span>

        <Button type="button" size="icon" {...plusProps}>
          <PlusIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
