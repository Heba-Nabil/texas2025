import localFont from "next/font/local";

export const bahij = localFont({
  src: "../../public/fonts/BahijTheSansArabicBold.ttf",
  weight: "700",
  variable: "--font-bahij",
});

export const biker = localFont({
  src: "../../public/fonts/BikerDiamond.otf",
  weight: "700",
  variable: "--font-biker",
});

export const texas = localFont({
  src: [
    {
      path: "../../public/fonts/TexasChickenCondensed-Regular.woff",
      weight: "400",
    },
    {
      path: "../../public/fonts/TexasChickenCondensed-SemiBold.woff",
      weight: "600",
    },
    {
      path: "../../public/fonts/TexasChickenCondensed-Heavy.woff",
      weight: "700",
    },
  ],
  variable: "--font-texas",
});
