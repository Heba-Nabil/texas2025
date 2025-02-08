"use client";

import { useCallback, useEffect, useState } from "react";
import NextImage from "@/components/global/NextImage";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Types
import { PageSectionMediaType } from "@/types/api";

type BlogsDetailsSliderProps = {
  locale: string;
  media: PageSectionMediaType[];
};

export default function BlogInnerSlider(props: BlogsDetailsSliderProps) {
  const { locale, media } = props;

  const [api, setApi] = useState<CarouselApi>();
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    const progress = Math.max(0, Math.min(1, api?.scrollProgress() ?? 1));
    setScrollProgress(progress * 100);
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", onScroll);
    api.on("reInit", onScroll);
  }, [api, onScroll]);

  return (
    <div className="relative w-full">
      <Carousel
        opts={{ direction: locale === "ar" ? "rtl" : "ltr", dragFree: true }}
        setApi={setApi}
      >
        <CarouselContent>
          {media.map((item, index) => (
            <CarouselItem
              style={{ order: item.Order }}
              key={index}
              className="basis-4/5"
            >
              {item.Type === 2 && item.ImageUrl && (
                <NextImage
                  src={item.ImageUrl}
                  alt={item.Alt || item.Name}
                  width={500}
                  height={500}
                  className="aspect-square w-full rounded-md object-cover"
                />
              )}
              {item?.Type === 4 && item?.Video && (
                <video
                  width="500"
                  height="500"
                  controls
                  autoPlay
                  // poster={item?.ImageUrl!}
                  className="h-full w-full object-cover"
                >
                  <source src={item?.Video} type="video/mp4" />
                </video>
              )}
              {item?.Type === 5 && item?.YoutubeLink && (
                <iframe
                  src={item?.YoutubeLink}
                  width={500}
                  height={500}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                ></iframe>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {api && (
        <div className="pointer-events-none absolute inset-x-0 -bottom-6 z-10 mx-auto h-1 w-80 max-w-[90%] overflow-hidden rounded-sm bg-dark">
          <div
            className="absolute inset-y-0 -left-full w-full transition-all duration-300"
            style={{
              transform: `translate3d(${scrollProgress}%,0px,0px)`,
              backgroundImage: "linear-gradient(45deg, #E16101, #fff)",
            }}
          />
        </div>
      )}
    </div>
  );
}
