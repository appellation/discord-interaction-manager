import type { SWRConfiguration } from "swr";
import { getApplications, getCurrentApp } from "./state";

export const swrConfig: SWRConfiguration = {
	fetcher: async (resource, init) => {
		let id: string | null;
		let url: string;

		if (Array.isArray(resource)) {
			[url, id] = resource;
		} else {
			id = getCurrentApp();
			url = resource;
		}

		const { token } = getApplications()[id ?? ""];
		const headers = new Headers(init?.headers);
		headers.set("authorization", `Bearer ${token}`);

		const res = await fetch(`https://discord.com/api/v10${url}`, {
			headers,
			...init,
		});
		return res.json();
	},
};
