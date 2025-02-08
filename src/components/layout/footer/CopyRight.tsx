"use client";

import { MouseEvent } from "react";
import { ArrowLongUpIcon } from "@heroicons/react/24/solid";
import NextLink from "@/components/global/NextLink";
// Types
import { FooterResourcesProps } from "@/types/resources";

type CopyRightProps = {
  resources: FooterResourcesProps;
  showTerms: boolean;
  showPrivacy: boolean;
};

export default function CopyRight(props: CopyRightProps) {
  const { resources, showTerms, showPrivacy } = props;

  const handleGoToTop = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="border-t py-2">
      <div className="container">
        <div className="flex items-center gap-3">
          <div className="flex-grow">
            <p className="text-center text-xs" dir="ltr">
              &copy; {new Date().getFullYear()}. All Rights Reserved. |
              Developed & Designed by {` `}
              <a
                href="https://psdigital.me"
                target="_blank"
                rel="noopener"
                className="font-bold text-dark"
              >
                PSdigital
              </a>
            </p>
          </div>

          {(showTerms || showPrivacy) && (
            <div className="flex-grow">
              <p className="text-center text-xs">
                {showPrivacy && (
                  <>
                    <NextLink href="/privacy">
                      {resources["privacyPolicy"]}
                    </NextLink>{" "}
                    |{" "}
                  </>
                )}

                {showTerms && (
                  <NextLink href="/terms">
                    {resources["termsConditions"]}
                  </NextLink>
                )}
              </p>
            </div>
          )}

          <div className="shrink-0">
            <button
              type="button"
              className="flex-center size-8 overflow-hidden rounded-lg border-none bg-white text-dark"
              onClick={handleGoToTop}
              aria-label="go up"
            >
              <ArrowLongUpIcon className="animate-infinite animate-duration-[1500ms] animate-ease-in-out size-6 animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
