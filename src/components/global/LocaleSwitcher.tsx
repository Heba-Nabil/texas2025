"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/navigation";
import cn from "@/utils/cn";
// Types
import { LanguageProps } from "@/types/api";
import { clientSideFetch } from "@/utils";
import { GenericResponse } from "@/types";
import { routeHandlersKeys } from "@/utils/constants";

type LocaleSwitcherProps = {
  children: React.ReactNode;
  locale: string;
  languages: LanguageProps[];
  isUser: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function LocaleSwitcher(props: LocaleSwitcherProps) {
  const { children, locale, className, languages, isUser, ...rest } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const handleLocaleSwitch = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const currentUrl = pathname + (searchString ? "?" + searchString : "");

    const newLocale = languages?.find(
      (item) => item.Code?.toLowerCase() !== locale?.toLowerCase(),
    );

    router.replace(currentUrl, {
      locale: newLocale?.Code?.toLowerCase(),
      scroll: false,
    });

    router.refresh();

    if (isUser) {
      try {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        const response = await clientSideFetch<
          Promise<GenericResponse<string>>
        >(
          `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.changeLanguage}`,
          {
            method: "POST",
          },
        );

        if (response?.hasError) {
          return response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }
      } catch (error) {
        console.log("Err from customization page", (error as Error).message);
      }
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "smooth hover:text-main",
        {
          "font-bahij": locale !== "ar",
        },
        className,
      )}
      onClick={handleLocaleSwitch}
      {...rest}
    >
      {children}
    </button>
  );
}
