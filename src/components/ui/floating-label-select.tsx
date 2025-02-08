import React, { forwardRef, ComponentProps } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import cn from "@/utils/cn";

type SelectProps = ComponentProps<typeof Select>;

interface FloatingSelectProps extends Omit<SelectProps, 'ref'> {
  className?: string;
}

// FloatingSelect component
const FloatingSelect = forwardRef<HTMLButtonElement, FloatingSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Select {...props}>
        <SelectTrigger
          ref={ref}
          className={cn(
            "peer focus-visible:ring-main aria-[invalid='true']:ring-destructive",
            className
          )}
        >
          <SelectValue placeholder=" " />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    );
  }
);
FloatingSelect.displayName = "FloatingSelect";

// FloatingLabel component
const FloatingLabel = forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(
        "peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-aria-[invalid='true']:text-destructive dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
        className
      )}
      {...props}
    />
  );
});
FloatingLabel.displayName = "FloatingLabel";

// FloatingLabelSelect props
export interface FloatingLabelSelectProps extends SelectProps {
  id: string;
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

// FloatingLabelSelect component
const FloatingLabelSelect = forwardRef<
  React.ElementRef<typeof FloatingSelect>,
  FloatingLabelSelectProps
>(({ id, label, startIcon, endIcon, children, ...props }, ref) => {
  return (
    <div className="relative">
      {startIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{startIcon}</div>}
      {endIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{endIcon}</div>}
      <FloatingSelect
        ref={ref}
        {...props}
        className={cn({
          "pl-10": !!startIcon,
          "pr-10": !!endIcon,
        })}
      >
        {children}
      </FloatingSelect>
      <FloatingLabel
        htmlFor={id}
        className={cn({
          "start-8 peer-focus:start-2": !!startIcon,
        })}
      >
        {label}
      </FloatingLabel>
    </div>
  );
});
FloatingLabelSelect.displayName = "FloatingLabelSelect";

export { FloatingSelect, FloatingLabel, FloatingLabelSelect };