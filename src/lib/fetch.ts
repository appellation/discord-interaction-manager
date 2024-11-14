import type { QueryFunctionContext, QueryKey } from "@tanstack/react-query";
import { QueryClient, useQuery } from "@tanstack/react-query";
import type { RESTGetAPIOAuth2CurrentAuthorizationResult } from "discord-api-types/v10";
import { getApps, useCurrentApp } from "./state";

async function defaultQueryFn({ queryKey, signal }: QueryFunctionContext) {
	const [id, ...rest] = queryKey;
	const path = rest.join("/");

	return authFetch(id as string, path, null, { signal });
}

export class FetchError extends Error {
	public static async fromResponse(response: Response) {
		let message: string;
		try {
			const body = await response.json();
			message = body.message;

			const errors = Object.entries(body.errors ?? {});
			message +=
				"\n\n" +
				errors.reduce(
					(acc, [name, error]) =>
						acc +
						`${name}: ${(error as any)._errors.map((err: any) => err.message).join(" ")}`,
					"",
				);
		} catch {
			message = await response.text();
		}

		return new this(response, message);
	}

	public status: number;

	private constructor(response: Response, message: string) {
		super(message);
		this.status = response.status;
	}
}

export async function authFetch(
	id: string,
	path: string,
	body?: any,
	options?: RequestInit,
) {
	const apps = getApps();
	const token = id ? apps?.[id as string].token : null;

	const headers = new Headers();
	if (token) {
		headers.set("authorization", `Bearer ${token}`);
	}

	if (body != null) {
		headers.set("content-type", "application/json");
	}

	const res = await fetch(`https://discord.com/api/v10/${path}`, {
		...options,
		headers,
		body: body == null ? undefined : JSON.stringify(body),
	});

	if (!res.ok) {
		throw await FetchError.fromResponse(res);
	}

	return res.json();
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: defaultQueryFn,
			retry(failureCount, error) {
				if (error instanceof FetchError) {
					return error.status >= 500;
				}

				return failureCount < 10;
			},
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

export function useIsLoggedIn() {
	return useFetchCurrentApp() != null;
}
