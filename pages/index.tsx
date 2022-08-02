import { Button, Container, Typography, TextField, Stack } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';

import fetcher, { fetch } from '../src/fetcher';
import CommandList from '../src/components/ComandList';
import useSignInDialog from '../src/hooks/useSignInDialog';
import useToken from '../src/hooks/useToken';

function SignedIn() {
	const { data: me } = useSWR('/oauth2/@me', fetcher);
	const { data: commands, isValidating, mutate } = useSWR(() => `/applications/${me.application.id}/commands`, fetcher);

	const router = useRouter();

	const onEditClicked = (id: string) => () => {
    router.push(`/edit/${id}`)
  };
	const onDeleteClicked = (id: string) => async () => {
		await fetch(`/applications/${me.application.id}/commands/${id}`, { method: 'DELETE' });
		mutate();
	};
	const onAddClicked = () => {
    router.push('/add')
  };

  const [guildId, setGuildId] = useState('');

  return (
    <>
      <Typography variant="h4">Global Commands</Typography>
      <CommandList commands={commands} loading={isValidating} onAddClicked={onAddClicked} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />

      <Typography variant="h4" sx={{ marginTop: 3 }}>Guild Commands</Typography>
      <Stack direction='row' spacing={2}>
        <TextField label="Guild ID" type="number" onChange={(e) => setGuildId(e.target.value)} />
        <Link passHref href={`/${guildId}`}><Button disabled={guildId === ''} variant="contained">Go</Button></Link>
      </Stack>
    </>
  );
}

function SignedOut() {
  const [, setOpen] = useSignInDialog();

  return (
    <>
      <Typography>Sign in to view &amp; edit Discord application commands.</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Sign In</Button>
    </>
  )
}

export default function Home() {
  const [token] = useToken();

  return (
    <Container>
      {token ? <SignedIn /> : <SignedOut />}
    </Container>
  )
}
