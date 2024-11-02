import { defineConfig, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
	presets: [
		presetUno(),
		presetWebFonts({
			fonts: {
				sans: "Inter:400,500,600,700,800",
			},
		}),
	],
	theme: {
		colors: {
			background: "hsl(0 0% 100%)",
			foreground: "hsl(222.2 84% 4.9%)",
			primary: "hsl(222.2 47.4% 11.2%)",
			"primary-foreground": "hsl(210 40% 98%)",
			secondary: "hsl(210 40% 96.1%)",
			"secondary-foreground": "hsl(222.2 47.4% 11.2%)",
			border: "hsl(214.3 31.8% 91.4%)",
			input: "hsl(214.3 31.8% 91.4%)",
			ring: "hsl(222.2 84% 4.9%)",
		},
	},
});
