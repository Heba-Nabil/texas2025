import { useEffect, useMemo, useState } from "react";
import { RenderPropSticky } from "react-sticky-el";
import { elementsIds } from "@/utils/constants";
import cn from "@/utils/cn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Types
import { type CarouselApi } from "@/components/ui/carousel";

type MenuItemModifiersNavProps = {
  locale: string;
  data: {
    id: string;
    title: string;
  }[];
  activeIngredient: string;
  setIsNavFixed: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveIngredient: React.Dispatch<React.SetStateAction<string>>;
  setAccordionState: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function MenuItemModifiersNav(props: MenuItemModifiersNavProps) {
  const {
    locale,
    data,
    activeIngredient,
    setIsNavFixed,
    setActiveIngredient,
    setAccordionState,
  } = props;

  const [api, setApi] = useState<CarouselApi>();

  const activeIndex = useMemo(() => {
    return data.findIndex((item) => item.id === activeIngredient);
  }, [data, activeIngredient]);

  // Scroll Nav Carousal to selected Modifier
  useEffect(() => {
    if (!api) {
      return;
    }

    if (activeIndex !== -1) {
      api.scrollTo(activeIndex !== -1 ? activeIndex : 0);
    }
  }, [api, activeIndex]);

  // Scroll Meni Item Modifiers to Selected Modifier
  const handleClick = (id: string) => {
    setActiveIngredient(id);

    if (typeof window !== "undefined") {
      const scrollableDiv = document.getElementById(
        elementsIds?.customizeWrapper,
      );
      const scrollableDivOffset = scrollableDiv ? scrollableDiv.offsetTop : 0;

      const activeSection = document.getElementById(id);
      const activeSectionOffset = activeSection
        ? activeSection.offsetTop - scrollableDivOffset
        : 0;

      // const newNavState = [...accordionState, id];
      setAccordionState((prev) => [...prev, id]);

      scrollableDiv &&
        scrollableDiv.scrollTo({
          top: activeSectionOffset,
          behavior: "smooth",
        });
    }
  };

  return (
    <RenderPropSticky
      scrollElement="#customize_wrapper"
      onFixedToggle={(isFixed) => setIsNavFixed(isFixed)}
    >
      {({ isFixed, wrapperStyles, wrapperRef, holderStyles, holderRef }) => (
        <div ref={holderRef} style={holderStyles}>
          <div
            style={
              isFixed
                ? {
                    ...wrapperStyles,
                    zIndex: 10,
                    paddingBottom: 10,
                    paddingTop: 10,
                    backgroundColor: "#fff",
                  }
                : wrapperStyles
            }
            ref={wrapperRef}
          >
            <Carousel
              className="w-full"
              opts={{
                direction: locale === "ar" ? "rtl" : "ltr",
              }}
              setApi={setApi}
            >
              <CarouselContent className="ml-0 mr-0">
                {data?.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="me-2 block shrink-0 basis-auto ps-0"
                  >
                    <button
                      className={cn(
                        "smooth w-full whitespace-nowrap rounded-3xl border border-main px-4 text-center font-semibold capitalize hover:bg-main",
                        {
                          "bg-main": item.id === activeIngredient,
                        },
                      )}
                      onClick={() => handleClick(item.id)}
                    >
                      {item.title}
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      )}
    </RenderPropSticky>
  );
}
