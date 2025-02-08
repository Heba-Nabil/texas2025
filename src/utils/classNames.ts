import cn from "./cn";

export function defaultStartInputIconClassNames(classNames?: string) {
  return cn(
    "absolute size-6 flex top-2 start-2 text-gray-400 peer-disabled:cursor-not-allowed",
    classNames,
  );
}

export function defaultEndInputIconClassNames(classNames?: string) {
  return cn(
    "absolute size-6 flex top-2 end-2 text-gray-400 peer-disabled:cursor-not-allowed",
    classNames,
  );
}
