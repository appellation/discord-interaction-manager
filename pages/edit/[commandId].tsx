import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import ApplicationCommand, { CommandFields } from '../../src/components/ApplicationCommand';
import fetcher, { fetch } from '../../src/fetcher';
import useSaveData from '../../src/hooks/useSaveData';

export default function EditCommand() {
	const router = useRouter();
	const { commandId } = router.query;

	const { data: me } = useSWR('/oauth2/@me', fetcher);
	const { data: command, mutate } = useSWR(`/applications/${me?.application?.id}/commands/${commandId}`, fetcher);
	const { save, DisplayError } = useSaveData<CommandFields>(
		(command) => fetch(`/applications/${me.application.id}/commands/${commandId}`, {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(command),
		}),
		mutate,
	);

	return (
		<Container>
			{command ? <ApplicationCommand isGlobal={true} command={command} onSave={save} /> : "Loading"}
			<DisplayError />
		</Container>
	);
}
