import { Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';

export interface Output<T> {
	save(args: T): Promise<void>;
	DisplayError: FunctionComponent;
}

export default function useSaveData<T>(
	doSave: (args: T) => Promise<Response>,
	onSaved?: (args: T) => void,
): Output<T> {
	const router = useRouter();
	const [error, setError] = useState<Error | null>(null);

	const save = async (args: T) => {
		try {
			const res = await doSave(args);

			if (!res.ok) {
				throw new Error(await res.text());
			}

			onSaved?.(args);
			router.back();
		} catch (e) {
			setError(e as Error);
		}
	};

	const handleClose = () => {
		setError(null);
	};

	function DisplayError() {
		return (
			<Snackbar open={error !== null} onClose={handleClose}>
				<Alert elevation={3} variant='filled' severity='error' onClose={handleClose}>{error?.message ?? 'Something went wrong!'}</Alert>
			</Snackbar>
		);
	}

	return {
		save,
		DisplayError,
	};
}
