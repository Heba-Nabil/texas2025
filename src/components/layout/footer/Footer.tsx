"use client";

import { useSearchParams } from "next/navigation";
import { useData } from "@/providers/DataProvider";
import { fixedKeywords } from "@/utils/constants";
import { displayInOrder, isModuleOn } from "@/utils";
import { getGuestSession } from "@/utils/getSessionHandler";
import useOrders from "@/hooks/useOrders";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import { toggleModal } from "@/store/features/global/globalSlice";
import { usePathname } from "@/navigation";
import NextImage from "@/components/global/NextImage";
import NextLink from "@/components/global/NextLink";
import TradeMark from "@/components/global/TradeMark";
import CopyRight from "./CopyRight";
// Types
import { FooterResourcesProps } from "@/types/resources";
import { FooterLinkProps } from "@/types";
import { PageSectionResponseType } from "@/types/api";

type FooterProps = {
  locale: string;
  resources: FooterResourcesProps;
  staticFooter1: FooterLinkProps[];
  staticFooter2: FooterLinkProps[];
  staticFooter3: FooterLinkProps[];
  trackOrderLabel: string;
  mobileAppsData: PageSectionResponseType[];
};

export default function Footer(props: FooterProps) {
  const {
    locale,
    resources,
    staticFooter1,
    staticFooter2,
    staticFooter3,
    trackOrderLabel,
    mobileAppsData,
  } = props;

  const {
    SocialPlatforms,
    Name,
    Categories,
    Data: { CustomerServiceLine },
    Module,
  } = useData();

  const sortedCategories = displayInOrder(Categories);

  const { isUser, isGuest } = useAppSelector(getClientSession);

  const { data: guestOrdersData } = useOrders(locale, isGuest);
  const { data: userOrdersData } = useOrders(locale, isUser);

  const availableGuestSession = getGuestSession();

  const dispatch = useAppDispatch();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isCheckout = pathname.indexOf("/checkout") !== -1;
  // Remove it in case of checkout page
  if (isCheckout) return null;

  if (searchParams.get(fixedKeywords.AppView)) {
    return null;
  }

  return (
    <>
      <footer className="bg-dark py-6 text-white">
        <div className="container">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3">
              <NextLink href="/" className="flex max-w-[160px]">
                <img
                  src={
                    locale === "ar"
                      ? "/images/icons/Texas-w-ar.svg"
                      : "/images/icons/Texas-w.svg"
                  }
                  alt="logo"
                  width={160}
                  height={160}
                  loading="lazy"
                  className="object-contain"
                />
              </NextLink>

              <p className="mt-3">{resources["footerDesc"]}</p>

              <p className="mt-3">
                <TradeMark label={resources["texasChicken"]} />
                &nbsp; | &nbsp; {Name}
                <button
                  type="button"
                  className="ms-1 text-accent"
                  onClick={() =>
                    dispatch(
                      toggleModal({ changeCountryModal: { isOpen: true } }),
                    )
                  }
                >
                  {resources["change"]}
                </button>
              </p>
            </div>

            <div className="col-span-9">
              <div className="grid w-full grid-cols-5 gap-3">
                {sortedCategories?.length > 0 && (
                  <div className="flex-grow">
                    <h2 className="mb-2 font-bold uppercase xl:text-lg">
                      {resources["menu"]}
                    </h2>

                    <ul>
                      {sortedCategories?.slice(0, 3).map((item) => (
                        <li key={item.ID} className="py-1">
                          <NextLink
                            href={`/menu/${item.NameUnique}`}
                            className="smooth block w-fit text-sm capitalize hover:text-main xl:text-base"
                          >
                            {item.Name}
                          </NextLink>
                        </li>
                      ))}

                      <li className="py-1">
                        <NextLink
                          href="/menu"
                          className="smooth block w-fit text-sm capitalize hover:text-main xl:text-base"
                        >
                          {resources["viewAll"]}
                        </NextLink>
                      </li>
                    </ul>
                  </div>
                )}

                {staticFooter1?.length > 0 && (
                  <div className="flex-grow">
                    <h2 className="mb-2 font-bold uppercase xl:text-lg">
                      {resources["discover"]} {resources["texas"]}
                      {/* <TradeMark label={resources["texasChicken"]} /> */}
                    </h2>

                    <ul>
                      {staticFooter1?.map((item) => (
                        <li key={item.id} className="py-1">
                          {!item.isInternal ? (
                            <a
                              href={item.href}
                              className="smooth block w-fit text-sm capitalize hover:text-main xl:text-base"
                              rel="noopener"
                              target="_blank"
                            >
                              {item.title}
                            </a>
                          ) : (
                            <NextLink
                              href={item.href}
                              className="smooth block w-fit text-sm capitalize hover:text-main xl:text-base"
                            >
                              {item.title}
                            </NextLink>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {staticFooter2?.length > 0 && (
                  <div className="flex-grow">
                    <h2 className="mb-2 font-bold uppercase xl:text-lg">
                      {resources["letsTalk"]}
                    </h2>

                    <ul>
                      {staticFooter2?.map((item) => (
                        <li key={item.id} className="py-1">
                          <NextLink
                            href={item.href}
                            className="smooth block w-fit text-sm capitalize hover:text-main xl:text-base"
                          >
                            {item.title}
                          </NextLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {staticFooter3?.length > 0 && (
                  <div className="flex-grow">
                    <h2 className="mb-2 font-bold uppercase xl:text-lg">
                      {resources["texasWay"]}
                    </h2>

                    <ul>
                      {staticFooter3?.map((item) => (
                        <li key={item.id} className="py-1">
                          <NextLink
                            href={item.href}
                            className="smooth block w-fit text-sm capitalize hover:text-main xl:text-base"
                          >
                            {item.title}
                          </NextLink>
                        </li>
                      ))}

                      {isGuest &&
                        availableGuestSession &&
                        guestOrdersData &&
                        guestOrdersData?.length > 0 && (
                          <li className="py-1">
                            <NextLink
                              href={`/track-order/${guestOrdersData[0]?.OrderNumber}`}
                              className="smooth block text-sm capitalize hover:text-main xl:text-base"
                            >
                              {trackOrderLabel}
                            </NextLink>
                          </li>
                        )}

                      {isUser &&
                        userOrdersData &&
                        userOrdersData?.length > 0 && (
                          <li className="py-1">
                            <NextLink
                              href="/dashboard/orders"
                              className="smooth block text-sm capitalize hover:text-main xl:text-base"
                            >
                              {trackOrderLabel}
                            </NextLink>
                          </li>
                        )}
                    </ul>
                  </div>
                )}

                <div>
                  <div>
                    <h2 className="mb-3 font-bold uppercase xl:text-lg">
                      {resources["followUsOn"]}
                    </h2>

                    {SocialPlatforms?.length > 0 && (
                      <ul className="flex items-center gap-3">
                        {SocialPlatforms?.map((item, index) => (
                          <li key={index}>
                            <a
                              href={item.URL}
                              target="_blank"
                              rel="noopener"
                              aria-label={item.Name}
                            >
                              <NextImage
                                src={item.IconURL}
                                alt={item.Name}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {mobileAppsData?.length > 0 && (
                    <div className="mt-5">
                      <h2 className="mb-3 font-semibold uppercase xl:text-lg">
                        {resources["downloadOurApps"]}
                      </h2>

                      <ul className="flex items-center gap-2">
                        {mobileAppsData?.map((item, index) => (
                          <li key={index} className="flex-1">
                            <a
                              key={index}
                              href={item.Link1?.trim()}
                              target="_blank"
                              rel="noopener"
                              className="flex"
                              aria-label={item.Name?.trim()}
                            >
                              {item.ImageUrl?.trim() && (
                                <img
                                  src={item.ImageUrl?.trim()}
                                  alt={item.Name?.trim() || "mobile app"}
                                  width={130}
                                  height={40}
                                  loading="lazy"
                                  className="h-auto w-full object-contain"
                                />
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {parseInt(CustomerServiceLine?.trim())
                    ? Boolean(isModuleOn(Module, "FooterDelivery")) && (
                        <div className="mt-4">
                          <a href={`tel:${CustomerServiceLine?.trim()}`}>
                            <NextImage
                              src="/images/Delivery_LTR.png"
                              alt="hot line"
                              width={150}
                              height={70}
                            />
                          </a>
                        </div>
                      )
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CopyRight
        resources={resources}
        showTerms={Boolean(isModuleOn(Module, "Footer_TermsAndcondition"))}
        showPrivacy={Boolean(isModuleOn(Module, "Footer_Privacy"))}
      />
    </>
  );
}
