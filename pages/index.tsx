import { Button, Container, Typography } from '@mui/material';
import CommandList from '../src/components/ComandList';
import useSignInDialog from '../src/hooks/useSignInDialog';
import useToken from '../src/hooks/useToken';

function SignedOut() {
  const [, setOpen] = useSignInDialog();

  return (
    <Container>
      <Typography>Sign in to view &amp; edit Discord application commands.</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Sign In</Button>
    </Container>
  )
}

export default function Home() {
  const [token] = useToken();

  return (
    <div>
      {token ? <CommandList /> : <SignedOut />}
    </div>
  )
}
