"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import cn from "@/utils/cn";
import { Input } from "@/components/ui/input";
// Types
import { MenuSearchResourcesProps } from "@/types/resources";

type MenuSearchProps = {
  locale: string;
  className?: string;
  resources: MenuSearchResourcesProps;
};

export default function MenuSearch(props: MenuSearchProps) {
  const { locale, className, resources } = props;

  return (
    <div className={cn("relative w-full lg:w-1/2", className)}>
      <form className="relative w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md sm:text-sm">
        <Input
          id="menu_searchbar"
          placeholder={resources["searchHere"] + "..."}
          className="w-full border-none py-2.5 pe-10 ps-3 text-sm leading-5 text-gray-900 focus:ring-0 focus-visible:ring-transparent"
        />

        <button
          type="submit"
          aria-label="search submit"
          className="flex-center absolute top-0 h-full w-10 ltr:right-0 rtl:left-0"
        >
          <MagnifyingGlassIcon className="size-5 text-gray-400" />
        </button>
      </form>
    </div>
  );
}
