import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { getAllPageSection } from "@/server/services/globalService";
import { isModuleOn, sortByOrder } from "@/utils";
// Types
import {
  BottomNavResourcesProps,
  FooterResourcesProps,
  HeaderResourcesProps,
} from "@/types/resources";
import { CountryModuleProps, PageSectionResponseType } from "@/types/api";

const DynamicHeader = dynamic(() => import("./header/Header"));

const DynamicBottomNav = dynamic(
  () => import("@/components/layout/footer/BottomNav"),
);

const DynamicFooter = dynamic(() => import("./footer/Footer"));

type MainLayoutProps = {
  children: React.ReactNode;
  locale: string;
  modules: CountryModuleProps[];
  enableLoyalty: boolean;
};

export default async function MainLayout(props: MainLayoutProps) {
  const { children, locale, modules, enableLoyalty } = props;

  const t = await getTranslations();

  const trackOrderLabel = t("trackOrder");

  const headerResources: HeaderResourcesProps = {
    texasChicken: t("texasChicken"),
    langBtn: t("langBtn"),
    change: t("change"),
    findStore: t("findStore"),
    signIn: t("signIn"),
    goodMorning: t("goodMorning"),
    goodAfternoon: t("goodAfternoon"),
    goodEvening: t("goodEvening"),
    myCart: t("myCart"),
    profile: t("profile"),
    rewards: t("rewards"),
    orderHistory: t("orderHistory"),
    favourites: t("favourites"),
    logOut: t("logOut"),
    searchHere: t("searchHere"),
    trackOrder: t("trackOrder"),
    hiGuest: t("hiGuest"),
  };

  const footerResources: FooterResourcesProps = {
    footerDesc: t("footerDesc"),
    texasChicken: t("texasChicken"),
    change: t("change"),
    discover: t("discover"),
    followUsOn: t("followUsOn"),
    letsTalk: t("letsTalk"),
    downloadOurApps: t("downloadOurApps"),
    downloadOn: t("downloadOn"),
    googlePlayStore: t("googlePlayStore"),
    appStore: t("appStore"),
    privacyPolicy: t("privacyPolicy"),
    termsConditions: t("termsConditions"),
    texasWay: t("texasWay"),
    menu: t("menu"),
    texas: t("texas"),
    viewAll: t("viewAll"),
  };

  const bottomNavResources: BottomNavResourcesProps = {
    home: t("home"),
    menu: t("menu"),
    profile: t("profile"),
    login: t("login"),
    more: t("more"),
    settings: t("settings"),
    langBtn: t("langBtn"),
    country: t("country"),
    contactUs: t("contactUs"),
    termsConditions: t("termsConditions"),
    privacyRequest: t("privacyRequest"),
    faq: t("faq"),
    reportIssue: t("reportIssue"),
    ourStory: t("ourStory"),
    locations: t("locations"),
    halal: t("halal"),
    helpCenter: t("helpCenter"),
    news: t("news"),
    blogs: t("blogs"),
    careers: t("careers"),
    party: t("party"),
    franchising: t("franchising"),
    trackOrder: t("trackOrder"),
    suggestFeature: t("suggestFeature"),
    privacyPolicy: t("privacyPolicy"),
    getApp: t("getApp"),
    birthdayPackage: t("birthdayPackage"),
    rewards: t("rewards"),
  };

  const staticFooterData = [
    {
      id: 1,
      title: t("ourStory"),
      href: "/about",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "STORY")),
    },
    {
      id: 2,
      title: t("news"),
      href: "/news",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "News")),
    },
    {
      id: 3,
      title: t("careers"),
      href: "/careers",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "CAREER")),
    },
    {
      id: 4,
      title: t("reportIssue"),
      href: "/report-issue",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "ReportIssue")),
    },
    {
      id: 5,
      title: t("franshising"),
      href: "https://franchise.texaschicken.com/",
      isInternal: false,
      isOn: Boolean(isModuleOn(modules, "FRANCHISING")),
    },
  ];

  const staticFooterData2 = [
    {
      id: 1,
      title: t("birthdayPackage"),
      href: "/birthday",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "BirthDayForm")),
    },
    {
      id: 2,
      title: t("party"),
      href: "/party",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "BirthDay")),
    },
    {
      id: 3,
      title: t("blogs"),
      href: "/blogs",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "BLOG")),
    },
    {
      id: 4,
      title: t("faq"),
      href: "/faq",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "FAQ")),
    },
    {
      id: 5,
      title: t("privacyRequest"),
      href: "/privacy-request",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "PrivacyRequest")),
    },
    {
      id: 6,
      title: t("suggestFeature"),
      href: "/suggest-feature",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "SuggestFeature")),
    },
  ];

  const staticFooterData3 = [
    {
      id: 1,
      title: t("halal"),
      href: "/halal",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "HALAL")),
    },
    {
      id: 2,
      title: t("rewards"),
      href: "/rewards",
      isInternal: true,
      isOn: enableLoyalty,
    },
    {
      id: 3,
      title: t("locations"),
      href: "/locations",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "LOCATION")),
    },
    {
      id: 4,
      title: t("getApp"),
      href: "/get-app",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "GetTheApp")),
    },
    {
      id: 5,
      title: t("contactUs"),
      href: "/contact",
      isInternal: true,
      isOn: Boolean(isModuleOn(modules, "CONTACT")),
    },
  ];

  let mobileAppsData: PageSectionResponseType[] = [];

  try {
    const mobileAppsResponse = await getAllPageSection(locale, "mobileApps");

    if (mobileAppsResponse?.data) {
      mobileAppsData = sortByOrder(mobileAppsResponse?.data);
    }
  } catch (error) {
    console.log("Error from get Mobile Apps", error);
  }

  return (
    <div className="flex min-h-screen w-full flex-col justify-between pb-[70px] lg:pb-0">
      <DynamicHeader locale={locale} resources={headerResources} />

      <main className="flex w-full flex-grow">{children}</main>

      <div className="lg:hidden">
        <DynamicBottomNav resources={bottomNavResources} locale={locale} />
      </div>

      <div className="hidden lg:block">
        <DynamicFooter
          locale={locale}
          resources={footerResources}
          staticFooter1={staticFooterData?.filter((item) => item.isOn)}
          staticFooter2={staticFooterData2?.filter((item) => item.isOn)}
          staticFooter3={staticFooterData3?.filter((item) => item.isOn)}
          trackOrderLabel={trackOrderLabel}
          mobileAppsData={mobileAppsData}
        />
      </div>
    </div>
  );
}
