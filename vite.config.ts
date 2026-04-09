import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Pre-compress: Brotli (prioritas utama, rasio kompresi terbaik)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024, // hanya compress file > 1KB
      deleteOriginFile: false,
    }),
    // Pre-compress: Gzip (fallback untuk browser lama / CDN tertentu)
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
      deleteOriginFile: false,
    }),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectManifest: {
        swDest: "dist/sw.js",
      },
      includeAssets: [
        "favicon.ico",
        "images/icons/*.png",
        "images/splash/*.png",
      ],
      manifest: {
        name: "Wafa Indonesia",
        short_name: "Wafa Indonesia",
        description:
          "lembaga pengembang metode pembelajaran Al-Qur'an inovatif berbasis otak kanan yang menyediakan sistem, metodologi, dan media untuk memudahkan belajar Al-Qur'an secara menyenangkan, mudah, dan efektif, bertujuan melahirkan generasi ahli Al-Qur'an yang mampu membaca, memahami, mempraktekkan, serta menghafal dengan konsep 5T (Tilawah, Tahfidz, Tarjamah, Tafhim, Tafsir).",
        theme_color: "#1a1a1a",
        background_color: "#1a1a1a",
        display: "standalone",
        start_url: "/",
        scope: "/",
        categories: ["finance", "productivity"],
        icons: [
          {
            src: "/images/icons/android-icon-36.png",
            sizes: "36x36",
            type: "image/png",
          },
          {
            src: "/images/icons/android-icon-48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/images/icons/android-icon-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/images/icons/android-icon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/images/icons/android-icon-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/images/icons/android-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/images/icons/android-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
