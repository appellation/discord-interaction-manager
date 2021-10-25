import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import fetcher, { fetch } from '../../src/fetcher';
import CommandList from '../../src/components/ComandList';

export default function GuildCommands() {
	const router = useRouter();
	const guildId = router.query.guildId;

	const { data: me } = useSWR('/oauth2/@me', fetcher);

	const basePath = `/applications/${me?.application?.id}/guilds/${guildId}/commands`;
	const { data: commands, isValidating, mutate } = useSWR(me && basePath, fetcher);

	const onEditClicked = (id: string) => () => {
    router.push(`${guildId}/edit/${id}`)
  };
	const onDeleteClicked = (id: string) => async () => {
		await fetch(`${basePath}/${id}`, { method: 'DELETE' });
		mutate();
	};

	const onAddClicked = () => {
		router.push(`/${guildId}/add`);
	};

	return (
		<Container>
			<Typography variant="h4">{guildId}</Typography>
			<CommandList commands={commands} loading={isValidating} onAddClicked={onAddClicked} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
		</Container>
	);
}
