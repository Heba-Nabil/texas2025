"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import {
  defaultEndInputIconClassNames,
  defaultStartInputIconClassNames,
} from "@/utils/classNames";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Types
import { PasswordValidationsProps } from "@/types";

const DynamicPasswordRules = dynamic(() => import("./PasswordRules"), {
  ssr: false,
});

const DynamicPasswordStrength = dynamic(() => import("./PasswordStrength"), {
  ssr: false,
});

type InputPasswordProps = {
  form: any;
  label?: string;
  name?: string;
  showStrength?: boolean;
  showValidationRules?: boolean;
} & React.HTMLAttributes<HTMLInputElement>;

const InputPassword = (props: InputPasswordProps) => {
  const {
    form,
    label,
    name = "password",
    showStrength,
    showValidationRules,
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setShowPassword((prev) => !prev);
  };

  const watchPassword = form.watch(name);

  const [showPopover, setShowPopover] = useState(false);

  const handleClosePopover = () => {
    setShowPopover(false);
  };

  const [passwordValidaity, setPasswordValidaity] =
    useState<PasswordValidationsProps>({
      minLength: false,
      lowerCase: false,
      upperCase: false,
      specialCharacter: false,
      minNumbers: false,
      noSpaces: false,
    });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {showValidationRules ? (
            <Popover open={showPopover} onOpenChange={() => null}>
              <PopoverTrigger asChild>
                <FormControl>
                  <FloatingLabelInput
                    startIcon={
                      <LockClosedIcon
                        className={defaultStartInputIconClassNames()}
                      />
                    }
                    endIcon={
                      <button
                        type="button"
                        aria-label="toggle show password"
                        className={defaultEndInputIconClassNames(
                          "flex-center p-0.5",
                        )}
                        onClick={togglePassword}
                      >
                        {showPassword ? (
                          <EyeIcon className="size-full" />
                        ) : (
                          <EyeSlashIcon className="size-full" />
                        )}
                      </button>
                    }
                    label={label}
                    type={showPassword ? "text" : "password"}
                    {...field}
                    onClick={() => setShowPopover(true)}
                    onFocus={() => setShowPopover(true)}
                    {...rest}
                  />
                </FormControl>
              </PopoverTrigger>

              <PopoverContent
                className="border-gray-100 p-0"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onEscapeKeyDown={handleClosePopover}
                onPointerDownOutside={handleClosePopover}
                onFocusOutside={handleClosePopover}
              >
                <DynamicPasswordRules
                  password={watchPassword}
                  passwordValidaity={passwordValidaity}
                  setPasswordValidaity={setPasswordValidaity}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <FormControl>
              <FloatingLabelInput
                startIcon={
                  <LockClosedIcon
                    className={defaultStartInputIconClassNames()}
                  />
                }
                endIcon={
                  <button
                    type="button"
                    aria-label="toggle show password"
                    className={defaultEndInputIconClassNames(
                      "flex-center p-0.5",
                    )}
                    onClick={togglePassword}
                  >
                    {showPassword ? (
                      <EyeIcon className="size-full" />
                    ) : (
                      <EyeSlashIcon className="size-full" />
                    )}
                  </button>
                }
                label={label}
                type={showPassword ? "text" : "password"}
                {...field}
                {...rest}
              />
            </FormControl>
          )}

          {showStrength && watchPassword && (
            <DynamicPasswordStrength
              totalScore={Object.keys(passwordValidaity).length}
              score={
                Object.values(passwordValidaity).filter((item) => item).length
              }
            />
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputPassword;
