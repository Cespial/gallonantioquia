/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Desde el panel se elige la foto de cada franja en la biblioteca de
    // medios, y las que se suben ahí (no las heredadas de /public) quedan
    // en Vercel Blob. `next/image` rechaza cualquier host que no esté en
    // esta lista, así que sin este patrón esas fotos romperían al pintarse.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
