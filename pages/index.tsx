import { Button, Container, Typography, TextField } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import fetcher, { fetch } from '../src/fetcher';
import CommandList from '../src/components/ComandList';
import useSignInDialog from '../src/hooks/useSignInDialog';
import useToken from '../src/hooks/useToken';
import { useRef } from 'react';

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

  const guildIdField = useRef<HTMLInputElement>(null);

  return (
    <>
      <Typography variant="h4">Global Commands</Typography>
      <CommandList commands={commands} loading={isValidating} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />

      <Typography variant="h4">Guild Commands</Typography>
      <TextField label="Guild ID" type="number" inputRef={guildIdField} />
      <Link passHref={true} href={`/${guildIdField.current?.value}`}><Button variant="contained">Go</Button></Link>
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
