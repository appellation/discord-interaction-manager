import useSWR from 'swr';
import { Checkbox, Container, Fab, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColumns } from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';

import fetcher, { fetch } from '../fetcher';

export default function Commands() {
	const { data: me } = useSWR('/oauth2/@me', fetcher);
	const { data: commands, isValidating, mutate } = useSWR(() => `/applications/${me.application.id}/commands`, fetcher);
	const router = useRouter();

	const onEditClicked = (id: string) => () => router.push(`/edit/${id}`);
	const onDeleteClicked = (id: string) => async () => {
		await fetch(`/applications/${me.application.id}/commands/${id}`, { method: 'DELETE' });
		mutate();
	};

	const cols: GridColumns = [
		{ field: 'name', headerName: 'Name' },
		{
			field: 'type',
			headerName: 'Type',
			valueGetter(params) {
				switch (params.value) {
					case 1: return 'Chat Input';
					case 2: return 'User';
					case 3: return 'Message';
					default: return 'Unknown';
				}
			}
		},
		{ field: 'description', headerName: 'Description', flex: 1 },
		{
			field: 'default_permission',
			headerName: 'Default Permission',
			renderCell(params) {
				return <Checkbox checked={!!params.value} disabled={true} />
			}
		},
		{
			field: 'actions',
			type: 'actions',
			getActions(params) {
				return [
					<GridActionsCellItem key="1" icon={<Edit />} label="Edit" onClick={onEditClicked(params.row.id)} />,
					<GridActionsCellItem key="2" icon={<Delete />} label="Delete" onClick={onDeleteClicked(params.row.id)} />
				];
			}
		}
	];

	const onAddClicked = () => router.push('/add');

	return (
		<Container>
			<Typography variant="h4">Global Commands</Typography>
			<div style={{ display: 'flex', height: '100%' }}>
				<div style={{ flexGrow: 1 }}>
					<DataGrid loading={isValidating} autoHeight columns={cols} rows={commands ?? []} />
					<Fab color="primary" aria-label="add" onClick={onAddClicked} sx={{ position: 'absolute', right: 36, bottom: 36 }}>
						<Add />
					</Fab>
				</div>
			</div>
		</Container>
	);
}
