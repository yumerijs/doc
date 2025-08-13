import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), // HMR 自动启用
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: true, // 启动时自动打开浏览器，杂鱼大哥哥♡喜欢吗？
    strictPort: true, // 如果端口被占用就报错，而不是随机换端口
    hmr: {
      overlay: true, // 页面报错时显示浮层
    },
  },
})
