"use client";

import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/solid";
import cn from "@/utils/cn";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-30 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps {
  overLayClassName?: string;
  className?: string;
  children: React.ReactNode;
}

const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ overLayClassName, className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className={overLayClassName} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed bottom-0 left-[50%] z-30 grid w-full max-w-xl translate-x-[-50%] gap-4 rounded-t-3xl bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:bottom-auto sm:top-[50%] sm:translate-y-[-50%] sm:rounded-3xl",
        className,
      )}
      onPointerDownOutside={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
      onOpenAutoFocus={(e) => {
        e.preventDefault();
      }}
      {...props}
    >
      <div className="flex w-full flex-col">{children}</div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

type DialogHeaderProps = {
  title?: string;
  showCloseBtn?: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("m-auto text-center text-xl font-bold uppercase", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogHeader = ({
  className,
  title,
  showCloseBtn = true,
  children,
}: DialogHeaderProps) => (
  <div className={cn("relative flex min-h-[50px] px-4", className)}>
    {title ? (
      <DialogTitle>{title}</DialogTitle>
    ) : (
      <DialogTitle className="sr-only">title</DialogTitle>
    )}

    {showCloseBtn && (
      <DialogPrimitive.Close className="flex-center smooth absolute top-1/2 ms-auto h-7 w-7 -translate-y-1/2 rounded-full bg-gray-200 text-gray-600 opacity-70 hover:text-dark hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <XMarkIcon className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    )}

    {children}
  </div>
);
DialogHeader.displayName = "DialogHeader";

const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={className} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogContentWrapper = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("max-h-[60vh] overflow-y-auto p-4", className)}
    {...props}
  />
);
DialogContentWrapper.displayName = "DialogContentWrapper";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-4 px-4 pb-6 pt-3",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogContentWrapper,
  DialogFooter,
};
