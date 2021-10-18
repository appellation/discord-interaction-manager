import axios from 'axios';
import { KEY_AUTH_TOKEN, KEY_CLIENT_ID, KEY_CLIENT_SECRET } from './constants';

export default async function exchangeCredentials() {
	const clientId = window.localStorage.getItem(KEY_CLIENT_ID);
	const clientSecret = window.localStorage.getItem(KEY_CLIENT_SECRET);
	const source = axios.CancelToken.source()

	if (!clientId || !clientSecret) throw new Error('missing client ID or secret');

	const data = new URLSearchParams();
	data.set('grant_type', 'client_credentials');
	data.set('scope', 'guilds applications.commands.update');

	const res = await axios.post(`https://discord.com/api/oauth2/token`, data, {
		auth: {
			username: clientId,
			password: clientSecret,
		},
		cancelToken: source.token,
	});

	window.localStorage.setItem(KEY_AUTH_TOKEN, res.data.access_token);
}
