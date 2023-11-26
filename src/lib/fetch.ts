import type { RESTGetAPIOAuth2CurrentAuthorizationResult } from "discord-api-types/v10";
import useSWR from "swr";
import { useCurrentApp } from "./state";

export function useFetchCurrentApp() {
	const [currentApp] = useCurrentApp();
	return useFetchUser(currentApp);
}

export function useFetchUser(id: string | null) {
	return useSWR<RESTGetAPIOAuth2CurrentAuthorizationResult>([
		"/oauth2/@me",
		id,
	]);
}
