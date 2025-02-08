"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import cn from "@/utils/cn";

export function CustomSlider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
        <SliderPrimitive.Range className="absolute h-full bg-main" />
      </SliderPrimitive.Track>
      {props.value?.map((value, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="relative block h-5 w-5 cursor-pointer rounded-full border-2 border-alt bg-alt bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alt focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-alt px-1.5 py-0.5 text-xs font-bold text-white">
            {value} P
          </span>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
}
