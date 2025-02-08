import { toast } from "react-toastify";
import NextLink from "./NextLink";

type ToastViewProps = {
  title?: string;
  message?: string;
  link?: string
};

type ToastOptions = Parameters<typeof toast>[1];

type Id = ReturnType<typeof toast>;

export default function ToastView({ title, message, link }: ToastViewProps) {
  return (
    <div>
      <h5 className="font-semibold capitalize">{title}</h5>
      <p className="text-xs">{message}</p>

      {link && <NextLink href={link}>View</NextLink>}
    </div>
  );
}

export const toaster = (
  myProps: ToastViewProps,
  toastProps?: ToastOptions,
): Id => toast(<ToastView {...myProps} />, { ...toastProps });
// Success
toaster.success = (myProps: ToastViewProps, toastProps?: ToastOptions): Id =>
  toast.success(<ToastView {...myProps} />, { ...toastProps });
// Error
toaster.error = (myProps: ToastViewProps, toastProps?: ToastOptions): Id =>
  toast.error(<ToastView {...myProps} />, { ...toastProps });
