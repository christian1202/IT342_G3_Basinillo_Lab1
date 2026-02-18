/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // SAFE: Only allow images from your specific storage (Supabase)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Allow your database images
      },
    ],
    // DANGEROUS: Do NOT use strictly wildcards like '**' or just '*'
  },
};

export default nextConfig;
