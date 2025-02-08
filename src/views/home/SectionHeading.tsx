"use client";

import {
  ArrowRightCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import NextLink from "@/components/global/NextLink";

type SectionHeadingProps = {
  title?: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
};

export default function SectionHeading(props: SectionHeadingProps) {
  const { title, description, linkHref, linkLabel } = props;

  return (
    <div className="flex-between">
      <div className="flex-grow">
        {title && (
          <h2 className="text-2xl font-bold capitalize rtl:text-xl rtl:md:text-2xl">
            {title}
          </h2>
        )}

        {description && <p className="mt-1 text-lg">{description}</p>}
      </div>

      {linkHref && (
        <NextLink
          href={linkHref}
          className="flex-center smooth gap-2 capitalize hover:text-alt"
        >
          {linkLabel}
          <span className="flex-center size-6 rounded-full bg-main text-alt-foreground">
            <ChevronRightIcon className="size-4 rtl:-scale-x-100" />
          </span>
        </NextLink>
      )}
    </div>
  );
}
