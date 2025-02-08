"use client";

import cn from "@/utils/cn";

type RadioLabelProps = {
  children: React.ReactNode;
  className?: string;
  name: string;
  id: string;
  checked: boolean;
  labelClassName?: string;
  markWrapperClassName?: string;
} & React.HTMLAttributes<HTMLInputElement>;

export default function RadioLabel(props: RadioLabelProps) {
  const {
    children,
    className,
    name,
    id,
    // error,
    checked,
    labelClassName,
    markWrapperClassName,
    ...other
  } = props;

  return (
    <div className={className}>
      <input
        className="peer sr-only"
        type="radio"
        name={name}
        id={id}
        checked={checked}
        {...other}
      />
      <label
        className={cn(
          "smooth group flex cursor-pointer items-center rounded-lg border-2 border-gray-200 p-4 hover:bg-[#fffcf5] peer-checked:border-main peer-checked:bg-[#fffcf5]",
          labelClassName,
        )}
        htmlFor={id}
      >
        <div className="flex-grow">{children}</div>

        <div
          className={cn(
            "flex-center smooth aspect-square w-6 shrink-0 rounded-full border border-gray-200",
            { "border-none bg-main": checked },
            markWrapperClassName,
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-4 w-4 fill-current text-white", {
              hidden: !checked,
              block: checked,
            })}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </label>
    </div>
  );
}
