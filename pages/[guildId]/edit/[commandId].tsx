import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import ApplicationCommand, { CommandFields } from '../../../src/components/ApplicationCommand';
import fetcher, { fetch } from '../../../src/fetcher';
import useSaveData from '../../../src/hooks/useSaveData';

export default function EditGuildCommand() {
	const router = useRouter();
	const { guildId, commandId } = router.query;

	const { data: me } = useSWR('/oauth2/@me', fetcher);
	const { data: command, mutate } = useSWR(me && `/applications/${me?.application?.id}/guilds/${guildId}/commands/${commandId}`, fetcher);
	const { save, DisplayError } = useSaveData<CommandFields>(
		(command) => fetch(`/applications/${me.application.id}/guilds/${guildId}/commands/${commandId}`, {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(command),
		}),
		mutate,
	);

	return (
		<Container>
			{command ? <ApplicationCommand isGlobal={false} command={command} onSave={save} /> : "Loading"}
			<DisplayError />
		</Container>
	);
}
