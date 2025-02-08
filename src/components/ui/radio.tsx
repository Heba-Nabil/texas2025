"use client";

import { forwardRef } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import cn from "@/utils/cn";

type RadioProps = {
  wrapperClassName?: string;
  className?: string;
  iconWrapperClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const { wrapperClassName, className, iconWrapperClassName, id, ...rest } =
    props;

  return (
    <label
      htmlFor={id}
      className={cn("relative cursor-pointer", wrapperClassName)}
    >
      <input
        ref={ref}
        type="radio"
        className={cn(
          "peer invisible absolute inset-0 -z-10 opacity-0",
          className,
        )}
        id={id}
        {...rest}
      />

      <div
        className={cn(
          "flex-center smooth size-6 rounded-full bg-gray-200 text-gray-500 peer-checked:bg-main peer-checked:text-dark",
          iconWrapperClassName,
        )}
      >
        <CheckIcon className="size-4 shrink-0" />
      </div>
    </label>
  );
});
Radio.displayName = "Radio";

export { Radio };
