import {
	useReactTable,
	type ColumnDef,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";
import type {
	APIApplicationCommand,
	RESTGetAPIApplicationCommandsResult,
} from "discord-api-types/v10";
import { Link } from "wouter";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

const columns: ColumnDef<APIApplicationCommand>[] = [
	{ accessorKey: "type", header: "Type" },
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
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Menu</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild>
							<Link href={`/commands/${row.original.id}/edit`}>Edit</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

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
