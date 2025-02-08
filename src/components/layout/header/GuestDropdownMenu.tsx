import { UserIcon } from "@heroicons/react/24/solid";
import { usePathname } from "@/navigation";
import { AUTH_NOT_AVAILIABLE_REDIRECT, fixedKeywords } from "@/utils/constants";
import NextActiveLink from "@/components/global/NextActiveLink";
// Types
import { HeaderResourcesProps } from "@/types/resources";
import TrackIcon from "@/components/icons/TrackIcon";

type GuestDropdownMenuProps = {
  resources: HeaderResourcesProps;
  orderNumber: string;
};

export default function GuestDropdownMenu(props: GuestDropdownMenuProps) {
  const { resources, orderNumber } = props;

  const pathname = usePathname()?.toLowerCase();

  const isAuthRoute = AUTH_NOT_AVAILIABLE_REDIRECT?.find((item) =>
    pathname.startsWith(item),
  );

  return (
    <div className="group/drop relative hover:border-border">
      <button
        type="button"
        className="flex-center smooth flex-col hover:text-main"
      >
        <UserIcon className="size-[30px]" />
        {resources["hiGuest"]}
      </button>

      <ul className="smooth invisible absolute -start-[60px] top-full z-20 min-w-40 space-y-0.5 overflow-hidden rounded-md border bg-background p-0.5 opacity-0 shadow transition-all duration-200 group-hover/drop:visible group-hover/drop:opacity-100">
        <li>
          <NextActiveLink
            href={`/track-order/${orderNumber}`}
            className="flex items-center gap-2 rounded-md p-2 text-base hover:bg-gray-100 focus:bg-gray-100"
            activeClassName="bg-main text-dark hover:text-dark hover:bg-main"
          >
            <TrackIcon className="size-5" />
            <span>{resources["trackOrder"]}</span>
          </NextActiveLink>
        </li>

        <li>
          <hr />
        </li>

        <li>
          <NextActiveLink
            href={
              isAuthRoute
                ? "/login"
                : `/login?${fixedKeywords.redirectTo}=${pathname}`
            }
            className="flex items-center gap-2 rounded-md p-2 text-base hover:bg-gray-100 focus:bg-gray-100"
            activeClassName="bg-main text-dark hover:text-dark hover:bg-main"
            scroll={false}
          >
            <UserIcon className="size-5 shrink-0" />
            <span>{resources["signIn"]}</span>
          </NextActiveLink>
        </li>
      </ul>
    </div>
  );
}
