const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    appDir: true,
  },
  rewrites: async () => [
    {
      source: '/oauth/callback',
      destination: '/api/oauth/callback',
    }
  ]
}

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "sulani",
    project: "tourney",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
  }
);
