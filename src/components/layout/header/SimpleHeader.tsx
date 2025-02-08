"use client";

import { useRouter } from "@/navigation";

type SimpleHeaderProps = {
  locale: string;
  resources: {
    texasChicken: string;
  };
  handleClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
};

export default function SimpleHeader(props: SimpleHeaderProps) {
  const { locale, resources, handleClick } = props;

  const router = useRouter();

  return (
    <header className="flex-center border-b border-gray-200 bg-white py-1">
      <button onClick={handleClick} className="flex shrink-0" aria-label="logo">
        <img
          src={
            locale === "ar"
              ? "/images/icons/Texas logo AR.svg"
              : "/images/icons/Texas logo.svg"
          }
          alt={resources["texasChicken"]}
          width={64}
          height={64}
          loading="lazy"
          className="size-24 object-contain"
        />
      </button>
    </header>
  );
}
