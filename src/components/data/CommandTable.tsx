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
import { Link } from "wouter";

export const columns: ColumnDef<APIApplicationCommand>[] = [
	{ accessorKey: "type", header: "Type" },
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "description", header: "Description" },
	{
		accessorKey: "dm_permission",
		header: "DM Permission",
		cell({ getValue }) {
			return <Checkbox disabled checked={getValue() as boolean} />;
		},
	},
	{
		accessorKey: "default_permission",
		header: "Default Permission",
		cell({ getValue }) {
			return <Checkbox disabled checked={getValue() as boolean} />;
		},
	},
	{
		accessorKey: "nsfw",
		header: "NSFW",
		cell({ getValue }) {
			return <Checkbox disabled checked={getValue() as boolean} />;
		},
	},
	{
		id: "actions",
		cell({ row }) {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost">Menu</Button>
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
	data: RESTGetAPIApplicationCommandsResult;
	error?: Error | null;
}) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="rounded border">
			{error && <Alert variant="destructive">{error.toString()}</Alert>}
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
