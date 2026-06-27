/** @type {import('next').NextConfig} */

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/.
// The deploy workflow injects NEXT_PUBLIC_BASE_PATH = "/<repo>" so links and
// assets resolve correctly. Locally the var is unset, so basePath is "".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export', // static HTML export — required for GitHub Pages
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true, // emit /about/index.html so GitHub Pages resolves clean URLs
  images: {
    unoptimized: true, // no image optimization server on static hosting
  },
  // Surface the base path to client components that build asset URLs by hand.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
