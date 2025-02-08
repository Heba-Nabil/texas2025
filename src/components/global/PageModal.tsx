"use client";

import { useCallback, useRef, useEffect } from "react";
import cn from "@/utils/cn";
import usePageModal from "@/hooks/usePageModal";

type PageModalProps = {
  children: React.ReactNode;
  overlayClasses?: string;
  wrapperClasses?: string;
  modalTitle?: string;
  closeIcon?: React.ReactNode;
};

export default function PageModal(props: PageModalProps) {
  const { children, overlayClasses, wrapperClasses, modalTitle, closeIcon } =
    props;

  const overlay = useRef(null);
  const wrapper = useRef(null);

  const { handleModalDismiss } = usePageModal();

  const onDismiss = useCallback(
    () => handleModalDismiss(),
    [handleModalDismiss],
  );

  // const onClick = useCallback(
  //   (e) => {
  //     if (e.target === overlay.current || e.target === wrapper.current) {
  //       if (onDismiss) onDismiss();
  //     }
  //   },
  //   [onDismiss, overlay, wrapper]
  // );

  // const onKeyDown = useCallback(
  //   (e) => {
  //     if (e.key === "Escape") onDismiss();
  //   },
  //   [onDismiss]
  // );

  useEffect(() => {
    // document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      // document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={overlay}
      className={cn("fixed inset-0 z-40 mx-auto bg-black/40", overlayClasses)}
      // onClick={onClick}
    >
      <div
        ref={wrapper}
        className="smooth flex min-h-full items-end justify-center duration-700 md:items-center"
      >
        <div
          className={cn(
            "smooth w-full transform rounded-t-3xl shadow-xl md:max-w-xl md:rounded-3xl",
            wrapperClasses,
          )}
        >
          {(modalTitle || closeIcon) && (
            <div className="relative px-4 py-3">
              {modalTitle && (
                <h1 className="m-auto text-center text-3xl font-bold uppercase">
                  {modalTitle}
                </h1>
              )}

              {closeIcon && (
                <button
                  type="button"
                  className="flex-center smooth absolute top-1/2 ms-auto size-7 -translate-y-1/2 rounded-full bg-gray-200 text-gray-600 opacity-70 hover:text-dark hover:opacity-100 disabled:pointer-events-none"
                  onClick={onDismiss}
                >
                  {closeIcon}
                </button>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
