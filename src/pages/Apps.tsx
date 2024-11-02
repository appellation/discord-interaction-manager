import { AlertTriangleIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";
import { LoginDialog } from "~/components/LoginDialog";
import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { useFetchUser } from "~/lib/fetch";
import { useApps, useCurrentApp } from "~/lib/state";

function AppRow({ id }: { readonly id: string }) {
	const { data, error, isError } = useFetchUser(id);
	const [currentApp, setCurrentApp] = useCurrentApp();

	return (
		<div className="p-4 my-4 flex items-center gap-2 border rounded-lg shadow">
			<div className="grow-1">
				<span className="text-lg">
					{data?.application.name ?? "Unknown Application"}
					&nbsp;
					{error != null && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<AlertTriangleIcon className="w-4 h-4 color-red-600" />
								</TooltipTrigger>
								<TooltipContent className="color-red-600">
									{error.message}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</span>
				<br />
				<code>{id}</code>
			</div>
			<Button
				disabled={currentApp === id || isError}
				onClick={() => setCurrentApp(id)}
			>
				Select
			</Button>
			<Button aria-label="Remove" variant="destructive">
				<Trash2Icon className="w-4 h-4" />
			</Button>
		</div>
	);
}

export default function AppsPage() {
	const [apps] = useApps();
	const ids: string[] = useMemo(() => Object.keys(apps ?? {}), [apps]);

	return (
		<main className="container mx-auto">
			{ids.map((id) => (
				<AppRow id={id} key={id} />
			))}
			<LoginDialog asChild>
				<Button>Add App</Button>
			</LoginDialog>
		</main>
	);
}
