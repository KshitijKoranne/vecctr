import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow build to succeed even without all env vars filled in
  // Clerk and Convex are stubbed until keys are added
};

export default nextConfig;
