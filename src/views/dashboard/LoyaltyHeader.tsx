"use client";

import { usePathname, useRouter } from "@/navigation";
import RadioLabel from "@/components/ui/RadioLabel";

export default function LoyaltyHeader() {
  const pathname = usePathname()?.toLowerCase();
  const router = useRouter();

  const links = [
    {
      href: "/dashboard/rewards",
      activeImg: "/images/icons/active-rewards.svg",
      notActiveImg: "/images/icons/not-active-rewards.svg",
      label: "View Rewards",
    },
    {
      href: "/dashboard/deals",
      activeImg: "/images/icons/active-deals.svg",
      notActiveImg: "/images/icons/not-active-deals.svg",
      label: "View Deals",
    },
  ];

  return (
    <div className="flex-center gap-4">
      {links.map((item) => (
        <RadioLabel
          key={item.label}
          name="loyalty_tabs_options_wrapper"
          id={`loyalty_${item.label}`}
          checked={pathname === item.href}
          onChange={() => router.push(item.href)}
          className="max-w-48 flex-1"
          labelClassName="gap-4"
        >
          <img
            src={pathname === item.href ? item.activeImg : item.notActiveImg}
            alt={item.label}
            width={90}
            height={22}
            className="w-auto max-w-full object-contain"
          />
        </RadioLabel>
      ))}
    </div>
  );
}
