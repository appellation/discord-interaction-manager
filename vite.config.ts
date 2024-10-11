import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import unoCss from "unocss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [unoCss(), react()],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src"),
		},
	},
});
