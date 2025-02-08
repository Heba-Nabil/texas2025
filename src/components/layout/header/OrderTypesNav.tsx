import cn from "@/utils/cn";
import { displayInOrder } from "@/utils";
// Types
import { OrderTypeProps } from "@/types/api";

type OrderTypesNavProps = {
  data: OrderTypeProps[];
  selectedOrderTypeId: string | undefined;
  handleClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export default function OrderTypesNav(props: OrderTypesNavProps) {
  const { data, className, selectedOrderTypeId, handleClick } = props;

  return (
    <div className={cn("shrink-0", className)}>
      <ul className="flex-center no-scrollbar gap-1 overflow-x-auto whitespace-nowrap">
        {displayInOrder(data)?.map((item, index) => (
          <li key={index} className="min-w-16 shrink-0">
            <button
              type="button"
              className="flex-center group shrink-0 cursor-pointer flex-col gap-0.5 text-center disabled:pointer-events-none disabled:grayscale"
              onClick={(e) => handleClick(e, item.ID)}
            >
              <span
                className={cn(
                  "flex-center border-gray overflow-hidden rounded-full border-2 bg-white p-0.5 lg:p-1",
                  {
                    "border-main": selectedOrderTypeId === item.ID,
                  },
                )}
              >
                {item.IconURL && (
                  <img
                    src={item.IconURL}
                    alt={item.Name + "icon"}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="size-12 rounded-full lg:size-14"
                  />
                )}
              </span>
              <span
                className={cn(
                  "smooth text-sm capitalize group-hover:text-main lg:text-base",
                  { "text-main": selectedOrderTypeId === item.ID },
                )}
              >
                {item.Name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
