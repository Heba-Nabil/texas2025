import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";

type ErrorViewProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorView({ error, reset }: ErrorViewProps) {
  const t = useTranslations();

  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [error]);

  return (
    <div className="flex-center fixed inset-0 z-50 h-screen w-full bg-white/80 text-center">
      <div className="container py-10">
        <img
          src="/images/icons/500.svg"
          alt="server error"
          width={300}
          height={300}
          className="mx-auto max-w-full object-contain"
        />

        <p className="mt-3 text-3xl text-dark dark:text-gray-400">
          {t("someThingWentWrong")}
        </p>

        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <Button onClick={() => reset()}>{t("tryAgain")}</Button>
        </div>
      </div>
    </div>
  );
}
