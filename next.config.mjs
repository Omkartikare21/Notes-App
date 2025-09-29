/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverSourceMaps: true },
  productionBrowserSourceMaps: true, // client stack traces
  webpack: (config, { isServer }) => {
    if (isServer) config.devtool = 'source-map'; // server stack traces
    return config;
  },
  env: {
    MONGO_URI: process.env.MONGO_URI,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
