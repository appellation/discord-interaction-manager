import react from "@vitejs/plugin-react-swc";
import { presetUno } from "unocss";
import unoCss from "unocss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		unoCss({
			presets: [presetUno()],
		}),
		react(),
	],
});
