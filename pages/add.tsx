import { Container, Typography } from '@mui/material';
import useSWR from 'swr';
import ApplicationCommand, { CommandFields } from '../src/components/ApplicationCommand';
import fetcher, { fetch } from '../src/fetcher';

export default function Add() {
	const { data: me } = useSWR('/oauth2/@me', fetcher);

	const saveCommand = async (command: CommandFields) => {
		await fetch(`/applications/${me.application.id}/commands`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(command),
		});
	};

	return (
		<Container>
			<Typography variant="h4">Add Command</Typography>
			<ApplicationCommand isGlobal={true} onSave={saveCommand} />
		</Container>
	);
}
