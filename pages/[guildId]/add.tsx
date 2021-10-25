import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ApplicationCommand, { CommandFields } from '../../src/components/ApplicationCommand';
import fetcher, { fetch } from '../../src/fetcher';

export default function Add() {
	const router = useRouter();
	const { data: me } = useSWR('/oauth2/@me', fetcher);

	const saveCommand = async (command: CommandFields) => {
		await fetch(`/applications/${me.application.id}/guilds/${router.query.guildId}/commands`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(command),
		});
	};

	return (
		<Container>
			<Typography variant="h4">Add Command ({router.query.guildId})</Typography>
			<ApplicationCommand onSave={saveCommand} />
		</Container>
	);
}
