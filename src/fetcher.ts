import exchangeCredentials from './auth';
import { KEY_AUTH_TOKEN } from './constants';

export async function fetch(url: string, request: RequestInit = {}): Promise<Response> {
	const token = window.localStorage.getItem(KEY_AUTH_TOKEN);
	const headers = token ? { ...request.headers, Authorization: `Bearer ${token}` } : undefined;

	const res = await window.fetch(`https://discord.com/api/v10${url}`, { ...request, headers });

	if (res.status === 401) {
		window.localStorage.removeItem(KEY_AUTH_TOKEN);
		await exchangeCredentials();
		return fetch(url, request);
	}

	return res;
}

export default async function fetcher(url: string) {
	return (await fetch(url)).json();
}
