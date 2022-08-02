import { Container, Grid } from '@mui/material';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

export default function Footer() {
	return (
		<Container sx={{ marginTop: 6, marginBottom: 6 }}>
			<Grid container justifyContent='center'>
				<Grid item xs={2}>
					<NextLink href="https://github.com/appellation/discord-interaction-manager" passHref>
						<Link
							variant='body1'
							alignSelf='center'
							rel="noopener"
							target="_blank"
						>
							Github
						</Link>
					</NextLink>
				</Grid>
				<Grid item xs={2}>
					<NextLink href="/privacy" passHref><Link variant='body1'>Privacy Policy</Link></NextLink>
				</Grid>
			</Grid>
		</Container>
	);
}
