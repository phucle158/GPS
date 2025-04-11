import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Cấu hình đúng với index.html ở thư mục gốc
export default defineConfig({
  plugins: [react()],
});
