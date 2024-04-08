import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import libCss from "vite-plugin-libcss";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    libCss(),
    dts({
      include: ["./src/packages/**/*.{vue,ts,css}"],
    }),
  ],
  // 打包配置
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "./src/packages/index.ts"),
      name: "vue3-gantt-component",
      fileName: (format) => `vue3-gantt-component.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        dir: "dist",
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
