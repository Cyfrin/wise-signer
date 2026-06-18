import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // static site export

  trailingSlash: true, // IPFS support

  images: {
    unoptimized: true,
  },

  // pino (via wagmi/WalletConnect) optionally requires pino-pretty, which is
  // never used in the browser. Resolve it to nothing to silence the warning.
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = { ...(config.resolve.alias ?? {}), "pino-pretty": false };
    return config;
  },
};

export default nextConfig;
