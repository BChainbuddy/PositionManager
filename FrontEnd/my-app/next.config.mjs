import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "**",
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
