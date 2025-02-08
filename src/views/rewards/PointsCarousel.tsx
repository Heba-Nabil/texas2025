"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import cn from "@/utils/cn";
import NextImage from "@/components/global/NextImage";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Types
import { UserDealsResponseProps } from "@/types/api";

const TWEEN_FACTOR_BASE = 0.08;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type PointsCarouselProps = {
  data: UserDealsResponseProps[];
  locale: string;
  resources: {
    points: string;
  };
};

export default function PointsCarousel(props: PointsCarouselProps) {
  const { locale, data, resources } = props;

  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const [api, setApi] = useState<CarouselApi>();

  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((api: CarouselApi) => {
    if (!api) return;

    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;

    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api],
  );

  const setTweenNodes = useCallback((api: CarouselApi): void => {
    if (!api) return;

    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number") as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((api: CarouselApi) => {
    if (!api) return;

    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((api: CarouselApi, eventName?: string) => {
    if (!api) return;

    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === "scroll";

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0, 1).toString();
        const tweenNode = tweenNodes.current[slideIndex];
        tweenNode.style.transform = `scale(${scale})`;
      });
    });
  }, []);

  useEffect(() => {
    if (!api) return;

    setTweenNodes(api);
    setTweenFactor(api);
    tweenScale(api);

    onInit(api);
    onSelect(api);
    api
      .on("reInit", onInit)
      .on("reInit", onSelect)
      .on("select", onSelect)
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [api, setTweenFactor, setTweenNodes, tweenScale, onInit, onSelect]);

  return (
    <Carousel
      className="w-full"
      opts={{
        direction: locale === "ar" ? "rtl" : "ltr",
        align: "center",
        loop: true,
        dragFree: true,
      }}
      plugins={[plugin.current as any]}
      setApi={setApi}
    >
      <CarouselContent className="ml-0 mt-5">
        {data?.map((item, index) => (
          <CarouselItem
            key={item.ID}
            className="shrink-0 basis-4/5 pe-1 ps-0 sm:basis-3/5 md:basis-1/2 lg:basis-2/5 xl:basis-[30%] 2xl:basis-1/4"
          >
            <div
              className={cn(
                "embla__slide__number flex h-full w-full select-none flex-col items-center rounded-3xl bg-gray-100 px-4 py-10 transition-colors",
                {
                  "bg-main": selectedIndex === index,
                },
              )}
            >
              {item.IconURL?.trim() && (
                <NextImage
                  src={item.IconURL?.trim()}
                  alt={item.Name}
                  width={208}
                  height={208}
                  className="h-52 w-auto max-w-full object-contain"
                />
              )}

              <div className="mt-2 text-center">
                <span className="text-2xl font-bold uppercase text-alt">
                  {item?.Points} {resources["points"]}
                </span>

                <h3 className="text-2xl font-bold uppercase">
                  {item.Name?.trim()}
                </h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {scrollSnaps?.length > 0 && (
        <ul className="flex-center mt-6 gap-2.5">
          {scrollSnaps?.map((_, index) => (
            <li key={index}>
              <button
                type="button"
                className={cn("smooth size-4 rounded-full", {
                  "bg-gray-300": selectedIndex !== index,
                  "bg-main": selectedIndex === index,
                })}
                onClick={() => onDotButtonClick(index)}
                aria-label={`slide number ${index + 1}`}
              />
            </li>
          ))}
        </ul>
      )}
    </Carousel>
  );
}
