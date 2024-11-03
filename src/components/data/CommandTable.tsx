import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	useReactTable,
	type ColumnDef,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";
import {
	ApplicationCommandType,
	type APIApplicationCommand,
	type RESTGetAPIApplicationCommandsResult,
} from "discord-api-types/v10";
import { useCallback } from "react";
import { Link } from "wouter";
import { authFetch } from "~/lib/fetch";
import DeleteConfirmButton from "../DeleteConfirmButton";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

const columns: ColumnDef<APIApplicationCommand>[] = [
	{
		accessorKey: "type",
		header: "Type",
		cell({ getValue }) {
			return <span>{ApplicationCommandType[getValue() as number]}</span>;
		},
	},
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "description", header: "Description" },
	{
		accessorKey: "dm_permission",
		header: "DM Permission",
		cell({ getValue }) {
			return <Checkbox checked={getValue() as boolean} disabled />;
		},
	},
	{
		accessorKey: "default_permission",
		header: "Default Permission",
		cell({ getValue }) {
			return <Checkbox checked={getValue() as boolean} disabled />;
		},
	},
	{
		accessorKey: "nsfw",
		header: "NSFW",
		cell({ getValue }) {
			return <Checkbox checked={getValue() as boolean} disabled />;
		},
	},
	{
		id: "actions",
		cell({ row }) {
			return <CommandActions command={row.original} />;
		},
	},
];

function CommandActions({
	command,
}: {
	readonly command: APIApplicationCommand;
}) {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		async mutationFn(id: string) {
			await authFetch(
				command.application_id,
				`/applications/${command.application_id}/commands/${id}`,
				null,
				{
					method: "DELETE",
				},
			);
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["applications", command.application_id],
			});
		},
	});

	const handleDeleteClick = useCallback(() => {
		mutate(command.id);
	}, [mutate, command.id]);

	return (
		<div className="flex gap-2">
			<Button asChild>
				<Link href={`/commands/${command.id}/edit`}>Edit</Link>
			</Button>
			<DeleteConfirmButton disabled={isPending} onClick={handleDeleteClick} />
		</div>
	);
}

export default function CommandTable({
	data,
	error,
}: {
	readonly data: RESTGetAPIApplicationCommandsResult;
	readonly error?: Error | null;
}) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		initialState: {
			columnOrder: ["id", "name"],
		},
	});

	return (
		<div className="rounded border">
			{error && <Alert variant="destructive">{error.message}</Alert>}
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
