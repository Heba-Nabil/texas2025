"use client";

import { forwardRef } from "react";
import { Link, usePathname } from "@/navigation";
import cn from "@/utils/cn";

type NextActiveLinkProps = {
  activeClassName?: string;
} & React.ComponentProps<typeof Link>;

const NextActiveLink: React.ForwardRefExoticComponent<NextActiveLinkProps> =
  forwardRef((props: NextActiveLinkProps, ref) => {
    const { href, className, activeClassName, ...rest } = props;

    const pathname = usePathname();
    const isActive =
      decodeURI(pathname)?.toLowerCase() === (href as string).toLowerCase();

    return (
      <Link
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        href={href}
        className={cn(className, {
          [activeClassName!]: isActive,
        })}
        // scroll={false}
        prefetch={false}
        {...rest}
      />
    );
  });

NextActiveLink.displayName = "NextActiveLink";

export default NextActiveLink;
