import cn from "@/utils/cn";
import NextLink from "./NextLink";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";

type PageHeaderProps = {
  className?: string;
  title: string;
  titleClassName?: string;
  backHref?: string;
  backTitle?: string;
  backClassName?: string;
  children?: React.ReactNode;
};

export default function PageHeader(props: PageHeaderProps) {
  const {
    className,
    title,
    titleClassName,
    backHref,
    backTitle,
    backClassName,
    children
  } = props;

  return (
    <div
      className={cn("flex-between flex-wrap gap-3 border-b-2 py-3", className)}
    >
      <h1
        className={cn(
          "font-biker text-2xl font-bold uppercase",
          titleClassName,
        )}
      >
        {title}
      </h1>

      {backHref && (
        <NextLink
          href={backHref}
          className={cn(
            "smooth flex-center gap-1 capitalize text-accent hover:text-gray-600",
            backClassName,
          )}
        >
          <ArrowLeftCircleIcon className="size-4 rtl:-scale-x-100" />
          {backTitle}
        </NextLink>
      )}

      {children}
    </div>
  );
}
