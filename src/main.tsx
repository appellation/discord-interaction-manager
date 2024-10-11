import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import "@unocss/reset/tailwind.css";
import App from "./App.tsx";
import { queryClient } from "./lib/fetch.ts";

import "virtual:uno.css";

ReactDOM.createRoot(document.querySelector("#root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</React.StrictMode>,
);
