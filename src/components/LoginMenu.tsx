import { useMemo, useState } from "react";
import { LoginDialog } from "./LoginDialog";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useFetchUser } from "~/lib/fetch";
import type { ApplicationInfo } from "~/lib/state";
import { useApps, useCurrentApp } from "~/lib/state";

function AppMenuItem({
	id,
	checked,
}: {
	readonly checked: boolean;
	readonly id: string;
}) {
	const { data } = useFetchUser(id);
	const [, setCurrentApp] = useCurrentApp();

	return (
		<DropdownMenuCheckboxItem
			checked={checked}
			onSelect={() => setCurrentApp(id)}
		>
			{data?.application?.name ?? id}
		</DropdownMenuCheckboxItem>
	);
}

function AppMenu({ apps }: { readonly apps: Record<string, ApplicationInfo> }) {
	const orderedApps = useMemo(
		() =>
			Object.entries(apps)
				.map(([id, info]) => ({ id, ...info }))
				.sort((a, b) => a.id.localeCompare(b.id)),
		[apps],
	);
	const [currentApp, setCurrentApp] = useCurrentApp();
	const { data: currentAppAuth } = useFetchUser(currentApp);
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{currentAppAuth?.application?.name ?? "Login"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onSelect={() => setDialogOpen(true)}>
					Add App
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>My Applications</DropdownMenuLabel>
				{orderedApps.map((app) => (
					<AppMenuItem
						checked={currentApp === app.id}
						id={app.id}
						key={app.id}
					/>
				))}
				{currentApp ? (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => setCurrentApp(null)}>
							Sign Out
						</DropdownMenuItem>
					</>
				) : null}
			</DropdownMenuContent>
			<LoginDialog onOpenChange={setDialogOpen} open={dialogOpen} />
		</DropdownMenu>
	);
}

export default function LoginMenu() {
	const [apps] = useApps();

	return apps && Object.keys(apps).length ? (
		<AppMenu apps={apps} />
	) : (
		<LoginDialog asChild>
			<Button variant="outline">Login</Button>
		</LoginDialog>
	);
}
