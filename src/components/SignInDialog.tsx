import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, LinearProgress, Link, TextField } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useSWRConfig } from 'swr';

import exchangeCredentials from '../auth';
import { KEY_CLIENT_ID, KEY_CLIENT_SECRET } from '../constants';
import useSsrLocalStorage from '../hooks/useSsrLocalStorage';

export interface SignInDialogProps extends DialogProps {
	// onClose?: () => void,
}

export default function SignInDialog(props: SignInDialogProps) {
	const { mutate } = useSWRConfig();
	const [clientId, setClientId] = useSsrLocalStorage(KEY_CLIENT_ID, '');
	const [clientSecret, setClientSecret] = useSsrLocalStorage(KEY_CLIENT_SECRET, '');
	const [loading, setLoading] = useState(false);

  const validateClient = async (event: FormEvent<any>) => {
		event.preventDefault();
		setLoading(true);

    try {
			await exchangeCredentials();
    } catch (e) {
      console.error(e);
      return;
    } finally {
			mutate('/oauth2/@me');
			setLoading(false);
		}

		props.onClose?.({}, 'backdropClick');
  };

	return (
		<Dialog {...props}>
			{loading && <LinearProgress />}
			<DialogTitle>Sign In</DialogTitle>
			<form onSubmit={validateClient} autoComplete="off">
				<DialogContent>
					<DialogContentText>Enter your application credentials here. Your client credentials can be obtained from <Link href="https://discord.com/developers/applications">discord.com/developers/applications</Link>.</DialogContentText>
					<TextField
						id="discord-client-id"
						label="Client ID"
						fullWidth
						required
						margin="normal"
						value={clientId}
						onChange={e => setClientId(e.target.value)}
						variant="outlined"
					/>
					<TextField
						id="discord-client-secret"
						label="Client Secret"
						fullWidth
						required
						margin="normal"
						type="password"
						value={clientSecret}
						onChange={e => setClientSecret(e.target.value)}
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions>
					<Button color="primary" variant="text" onClick={() => props.onClose?.({}, 'backdropClick')}>Close</Button>
					<Button color="primary" variant="text" type="submit" disabled={loading || clientId.length === 0 || clientSecret.length === 0}>Validate</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
