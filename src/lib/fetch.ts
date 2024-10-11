import type { QueryFunctionContext, QueryKey } from "@tanstack/react-query";
import { QueryClient, useQuery } from "@tanstack/react-query";
import type { RESTGetAPIOAuth2CurrentAuthorizationResult } from "discord-api-types/v10";
import { getApps, useCurrentApp } from "./state";

async function defaultQueryFn({ queryKey, signal }: QueryFunctionContext) {
	const [id, ...rest] = queryKey;

	const apps = getApps();
	const token = id ? apps?.[id as string].token : null;
	const headers = new Headers();
	if (token) {
		headers.set("authorization", `Bearer ${token}`);
	}

	const path = rest.join("/");
	const res = await fetch(`https://discord.com/api/v10/${path}`, {
		headers,
		signal,
	});

	return res.json();
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: defaultQueryFn,
		},
	},
});

export function useQueryKey(key: QueryKey, applicationId?: string | null) {
	const [currentApp] = useCurrentApp();
	return [applicationId ?? currentApp, ...key];
}

export function useFetchCurrentApp() {
	return useFetchUser(null);
}

export function useFetchUser(id: string | null) {
	const queryKey = useQueryKey(["oauth2", "@me"], id);

	return useQuery<RESTGetAPIOAuth2CurrentAuthorizationResult>({
		queryKey,
	});
}
