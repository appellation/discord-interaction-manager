import React from "react";
import ReactDOM from "react-dom/client";
import "virtual:uno.css";
import "./globals.css";
import "@unocss/reset/tailwind-compat.css";
import { SWRConfig } from "swr";
import App from "./App.tsx";
import { swrConfig } from "./lib/config.ts";

ReactDOM.createRoot(document.querySelector("#root")!).render(
	<React.StrictMode>
		<SWRConfig value={swrConfig}>
			<App />
		</SWRConfig>
	</React.StrictMode>,
);
