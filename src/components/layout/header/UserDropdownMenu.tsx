import { useMemo } from "react";
import { HeartIcon, PowerIcon, UserIcon } from "@heroicons/react/24/solid";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import HistoryIcon from "@/components/icons/HistoryIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NextActiveLink from "@/components/global/NextActiveLink";
import RewardsIcon from "@/components/icons/RewardsIcon";
// Types
import { HeaderResourcesProps } from "@/types/resources";
import { UserSessionDataProps } from "@/types";

type UserDropdownMenuProps = {
  locale: string;
  enableLoyaltyProgram: boolean;
  resources: HeaderResourcesProps;
  data: UserSessionDataProps | undefined;
  userImg?: string | null;
};

export default function UserDropdownMenu(props: UserDropdownMenuProps) {
  const { enableLoyaltyProgram, resources, data, userImg } = props;

  const userMenuOptions = useMemo(() => {
    return [
      {
        id: 1,
        href: "/dashboard/profile",
        icon: <UserIcon className="size-5" />,
        title: resources["profile"],
      },
      enableLoyaltyProgram
        ? {
            id: 2,
            href: "/dashboard/rewards",
            icon: <RewardsIcon className="size-5" />,
            title: resources["rewards"],
          }
        : undefined,
      {
        id: 3,
        href: "/dashboard/orders",
        icon: <HistoryIcon className="size-5" />,
        title: resources["orderHistory"],
      },
      {
        id: 4,
        href: "/dashboard/favourites",
        icon: <HeartIcon className="size-5" />,
        title: resources["favourites"],
      },
    ];
  }, [resources, enableLoyaltyProgram]);

  const dispatch = useAppDispatch();

  return (
    <div className="group/drop relative hover:border-border">
      <button type="button">
        <Avatar>
          {userImg && <AvatarImage src={userImg} alt="profile logo" />}
          {data && (
            <AvatarFallback>
              {data?.firstName?.trim()[0]} {data?.lastName?.trim()[0]}
            </AvatarFallback>
          )}
        </Avatar>
      </button>

      <ul className="smooth invisible absolute -start-[60px] top-full z-20 min-w-40 space-y-0.5 overflow-hidden rounded-md border bg-background p-0.5 opacity-0 shadow transition-all duration-200 group-hover/drop:visible group-hover/drop:opacity-100">
        {userMenuOptions
          ?.filter((item) => !!item)
          ?.map((item, index) => (
            <li key={index}>
              <NextActiveLink
                href={item.href}
                className="flex items-center gap-2 rounded-md p-2 text-base hover:bg-gray-100 focus:bg-gray-100"
                activeClassName="bg-main text-dark hover:text-dark hover:bg-main"
              >
                {item.icon}
                <span>{item.title}</span>
              </NextActiveLink>
            </li>
          ))}

        <li>
          <hr />
        </li>

        <li>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md bg-gray-100 p-2 text-base hover:bg-alt hover:text-white focus:bg-alt focus:text-white"
            onClick={() =>
              dispatch(toggleModal({ logOutModal: { isOpen: true } }))
            }
          >
            <PowerIcon className="size-5" />
            <span>{resources["logOut"]}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
