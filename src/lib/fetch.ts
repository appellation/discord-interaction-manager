import type { RESTGetAPIOAuth2CurrentAuthorizationResult } from "discord-api-types/v10";
import { useApps, useCurrentApp } from "./state";
import {
	QueryFunction,
	QueryFunctionContext,
	QueryKey,
	useQuery,
} from "@tanstack/react-query";
import { useCallback } from "react";

export function useQueryFn<
	T = unknown,
	K extends QueryKey = QueryKey,
>(): QueryFunction<T, K> {
	const [currentApp] = useCurrentApp();
	const [apps] = useApps();

	return useCallback(
		async ({ queryKey, signal }: QueryFunctionContext<K>) => {
			const [id, ...rest] = queryKey;

			const queryId = (id as string | null) ?? currentApp;
			const token = queryId ? apps?.[queryId].token : null;
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
		},
		[currentApp, apps],
	);
}

export function useFetchCurrentApp() {
	const [currentApp] = useCurrentApp();
	return useFetchUser(currentApp);
}

export function useFetchUser(id: string | null) {
	const queryFn = useQueryFn<RESTGetAPIOAuth2CurrentAuthorizationResult>();

	return useQuery({
		queryKey: [id, "oauth2", "@me"],
		queryFn,
	});
}
