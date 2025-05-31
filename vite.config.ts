import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist", // 최종 결과물이 들어가는 폴더
    emptyOutDir: true, // 빌드할 때 dist 비워주기
    rollupOptions: {
      input: {
        popup: "src/popup/popup.html",
        options: "src/options/options.html",
        background: "src/background.ts",
        help: "src/help/help.html", // 라우팅 해줘야 동작
        canvas: "src/canvas/canvas.html",
      },
      output: {
        entryFileNames: "src/[name].js", // 파일명 유지하기
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "public/*",
          dest: ".", // dist에 그대로 복사
        },
        {
          src: "manifest.json",
          dest: ".", // dist에 복사
        },
      ],
    }),
  ],
});
