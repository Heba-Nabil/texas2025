import cn from "@/utils/cn";
// Types
import { ModifierGroupProps } from "@/types/api";
import { MenuItemPageResourcesProps } from "@/types/resources";

type MenuAddItemWrapperProps = {
  data: ModifierGroupProps;
  resources: MenuItemPageResourcesProps;
  remain: number;
  children: React.ReactNode;
};

export default function MenuAddItemWrapper(props: MenuAddItemWrapperProps) {
  const { data, resources, remain, children } = props;

  return (
    <div className="w-full">
      <span
        className={cn(
          "mt-1 flex items-center gap-1 text-sm font-semibold capitalize text-alt",
          // {
          //   "text-alt": remain <= data?.MinQuantity,
          // },
        )}
      >
        <img
          src="/images/icons/wonder-mark.svg"
          alt="wonder"
          width={16}
          height={16}
          loading="lazy"
          className="shrink-0 object-contain"
        />
        <span>
          {resources["min"]} {data?.MinQuantity}
        </span>
        ,
        <span>
          {resources["max"]} {data?.MaxQuantity}
        </span>
      </span>

      {children}
    </div>
  );
}
