"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getShowDashboardPages,
  toggleShowDashboardPages,
} from "@/store/features/global/globalSlice";
import cn from "@/utils/cn";
import { useEffect } from "react";

type DashBoardPagesWrapperProps = {
  children: React.ReactNode;
  boxClassName?: string;
  label?: string;
  closeMark?: React.ReactNode;
  otherLink?: React.ReactNode;
  cb?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

export default function DashBoardPagesWrapper(
  props: DashBoardPagesWrapperProps,
) {
  const {
    children,
    boxClassName,
    label,
    closeMark = <XMarkIcon className="size-5" />,
    otherLink,
    cb,
    ...other
  } = props;

  const showDashboardPage = useAppSelector(getShowDashboardPages);

  useEffect(() => {
    if (showDashboardPage) {
      if (window.matchMedia("(max-width: 1024px)").matches) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDashboardPage]);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleShowDashboardPages(false));

    cb && cb();
  };

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-in max-lg:fixed max-lg:left-0 max-lg:right-0 max-lg:z-30 max-lg:h-full",
        {
          "max-lg:top-0": showDashboardPage,
          "max-lg:top-full": !showDashboardPage,
        },
      )}
      {...other}
    >
      <div
        className={cn(
          "flex h-full flex-col rounded-lg bg-white py-5 shadow",
          boxClassName,
        )}
      >
        <div
          className={cn("flex items-center gap-3 px-5", {
            "mb-6": label,
          })}
        >
          <button
            className="shrink-0 lg:hidden"
            aria-label="close"
            onClick={handleClose}
          >
            <i className="flex-center size-9 rounded-full bg-gray-100">
              {closeMark}
            </i>
          </button>

          {label && (
            <h2 className="flex-grow font-biker text-xl font-bold capitalize">
              {label}
            </h2>
          )}

          {otherLink}
        </div>

        {children}
      </div>
    </div>
  );
}
