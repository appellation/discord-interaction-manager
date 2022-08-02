import { Alert, Container, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';

import ApplicationCommand, { CommandFields } from '../../src/components/ApplicationCommand';
import fetcher, { fetch } from '../../src/fetcher';

export default function EditCommand() {
	const router = useRouter();
	const { commandId } = router.query;

	const { data: me } = useSWR('/oauth2/@me', fetcher);
	const { data: command, mutate } = useSWR(`/applications/${me?.application?.id}/commands/${commandId}`, fetcher);

	const [error, setError] = useState<Error | null>(null);

	const saveCommand = async (command: CommandFields) => {
		try {
			const res = await fetch(`/applications/${me.application.id}/commands/${commandId}`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(command),
			});

			if (!res.ok) {
				throw new Error(await res.text());
			}

			mutate(command);
			router.back();
		} catch (e) {
			setError(e as Error);
		}
	};

	const handleClose = () => {
		setError(null);
	};

	return (
		<Container>
			{command ? <ApplicationCommand command={command} onSave={saveCommand} /> : "Loading"}
			<Snackbar open={error !== null} onClose={handleClose}>
				<Alert elevation={3} variant='filled' severity='error' onClose={handleClose}>{error?.message ?? 'Something went wrong!'}</Alert>
			</Snackbar>
		</Container>
	);
}
