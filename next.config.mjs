import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const config = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    images: {
      remotePatterns: [
        { hostname: "tx-imgrepository.psdigital.me", protocol: "https" },
        { hostname: "tx_srv_v72.psdigital.me", protocol: "https" },
        { hostname: "txv7.psdigital.me", protocol: "https" },
        { hostname: "tx-sb-imagerepository.psdigital.me", protocol: "https" },
      ],
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === "production",
    },
    // logging: {
    //   fetches: {
    //     fullUrl: true,
    //   },
    // },
    async redirects() {
      return [
        {
          source: "/:locale/dashboard",
          destination: "/:locale/dashboard/profile",
          permanent: false,
        },
        {
          source: "/.well-known/apple-app-site-association",
          destination: "/api/apple/apple-app-site-association",
          permanent: false,
        },
      ];
    },
  };

  return withNextIntl(nextConfig);
};

export default config;
