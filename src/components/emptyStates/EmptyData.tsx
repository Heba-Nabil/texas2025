import { useLocale, useTranslations } from "next-intl";
import { Button } from "../ui/button";
import NextLink from "../global/NextLink";

export default function EmptyData() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex-center my-auto w-full flex-col gap-4 py-10">
      <img
        src={
          locale === "ar"
            ? "/images/icons/Texas logo AR.svg"
            : "/images/icons/Texas logo.svg"
        }
        alt="empty data"
        width={160}
        height={160}
        className="aspect-square max-w-full object-contain"
        loading="lazy"
      />
      <div className="text-center">
        <h3 className="text-xl font-semibold">{t("noData")}</h3>
      </div>
      <div className="flex-center mt-5 flex-col gap-2 sm:flex-row sm:gap-3">
        <Button asChild>
          <NextLink href="/">{t("backToHome")}</NextLink>
        </Button>
      </div>
    </div>
  );
}
