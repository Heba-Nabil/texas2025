import { forwardRef } from "react";
import cn from "@/utils/cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const FloatingInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, dir, ...props }, ref) => {
    return (
      <Input
        placeholder=""
        dir={dir}
        className={cn(
          "peer focus-visible:ring-main aria-[checked='true']:border-green-600 aria-[invalid='true']:border-destructive aria-[checked='true']:ring-green-600 aria-[invalid='true']:ring-destructive",
          { "cursor-not-allowed opacity-50": disabled },
          className,
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  },
);
FloatingInput.displayName = "FloatingInput";

const FloatingLabel = forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "peer-focus:secondary peer-focus:dark:secondary absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-aria-[checked='true']:text-green-600 peer-aria-[invalid='true']:text-destructive dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = "FloatingLabel";

type FloatingLabelInputProps = InputProps & {
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

const FloatingLabelInput = forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, startIcon, endIcon, ...props }, ref) => {
  return (
    <div className="relative">
      {startIcon}
      {endIcon}
      <FloatingInput
        ref={ref}
        id={id}
        className={cn({
          "ps-10": !!startIcon,
          "pe-10": !!endIcon,
        })}
        {...props}
      />
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
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingInput, FloatingLabel, FloatingLabelInput };
