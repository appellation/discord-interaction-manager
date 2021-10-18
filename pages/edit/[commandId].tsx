import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import ApplicationCommand, { CommandFields } from '../../src/components/ApplicationCommand';
import fetcher, { fetch } from '../../src/fetcher';

export default function EditCommand() {
	const router = useRouter();
	const { commandId } = router.query;

	const { data: me } = useSWR('/oauth2/@me', fetcher);
	const { data: command, mutate } = useSWR(`/applications/${me?.application?.id}/commands/${commandId}`, fetcher);

	const saveCommand = async (command: CommandFields) => {
		await fetch(`/applications/${me.application.id}/commands/${commandId}`, {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(command),
		});

		mutate(command);
		router.back();
	};

	console.log(command);

	return (
		<Container>
			{command ? <ApplicationCommand command={command} onSave={saveCommand} /> : "Loading"}
		</Container>
	);
}
