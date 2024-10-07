import React from "react";
import ReactDOM from "react-dom/client";
import "virtual:uno.css";
import "./globals.css";
import "@unocss/reset/tailwind-compat.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/fetch.ts";

ReactDOM.createRoot(document.querySelector("#root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</React.StrictMode>,
);
