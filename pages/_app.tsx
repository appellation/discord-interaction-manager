import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { AccountCircle, ArrowBack } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import SignInDialog from '../src/components/SignInDialog';
import useSignInDialog from '../src/hooks/useSignInDialog';

import 'normalize.css';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  }
}))

function MyApp({ Component, pageProps }: AppProps) {
  const classes = useStyles();
  const [signInDialogOpen, setSignInDialogOpen] = useSignInDialog();
  const router = useRouter();

  const toggleAccountButton = useCallback(() => {
    setSignInDialogOpen(!signInDialogOpen);
  }, [signInDialogOpen, setSignInDialogOpen]);

  const onBackClicked = () => router.back();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <AppBar position="sticky" sx={{ mb: 3 }}>
        <Toolbar>
          {router.pathname !== '/' &&
            <IconButton edge="start" color="inherit" aria-label="back" onClick={onBackClicked} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
          }
          <Typography variant="h6" className={classes.title}>
            Discord Interactions
          </Typography>
          <IconButton edge="end" aria-label="account" color="inherit" onClick={toggleAccountButton}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SignInDialog open={signInDialogOpen} onClose={() => setSignInDialogOpen(false)} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
