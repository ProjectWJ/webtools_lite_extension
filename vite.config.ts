import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist", // 최종 결과물이 들어가는 폴더
    emptyOutDir: true, // 빌드할 때 dist 비워주기
    rollupOptions: {
      input: {
        popup: "src/popup/popup.html",
        setting: "src/setting/setting.html",
        background: "src/background.ts",
        // content: "src/content.ts", 현재 미사용 상태. 업데이트 시 꼭 주석 해제하기
        // help: "src/help/help.html", 현재는 더미
        colorpicker: "src/colorpicker/colorpicker.html",
        importbulma: resolve("src/import-bulma.ts"),
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
          src: "img/*",
          dest: "img",
        },
        {
          src: "manifest.json",
          dest: ".", // dist에 복사
        },
      ],
    }),
  ],
});
