import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // static site export

  trailingSlash: true, // IPFS support

  images: {
    unoptimized: true,
  },

  // pino (via wagmi/WalletConnect) optionally requires pino-pretty, which is
  // never used in the browser. Stub it out so neither bundler warns.
  // `next build` uses webpack; `next dev --turbopack` uses turbopack.
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = { ...(config.resolve.alias ?? {}), "pino-pretty": false };
    return config;
  },
  turbopack: {
    resolveAlias: { "pino-pretty": "./src/lib/empty.ts" },
  },
};

export default nextConfig;
