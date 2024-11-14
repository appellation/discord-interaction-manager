import { useQueryClient } from "@tanstack/react-query";
import { omit } from "lodash";
import { AlertTriangleIcon } from "lucide-react";
import { useMemo } from "react";
import { Redirect } from "wouter";
import DeleteConfirmButton from "~/components/DeleteConfirmButton";
import { LoginDialog } from "~/components/LoginDialog";
import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { useFetchUser, useQueryKey } from "~/lib/fetch";
import { useApps, useCurrentApp } from "~/lib/state";
import { cn } from "~/lib/utils";

function AppRow({ id }: { readonly id: string }) {
	const oauthQueryKey = useQueryKey(["oauth2", "@me"]);
	const queryClient = useQueryClient();

	const { data, error, isError } = useFetchUser(id);
	const [currentApp, setCurrentApp] = useCurrentApp();
	const [_apps, setApps] = useApps();
	const isCurrentApp = id === currentApp;

	const handleAppRemove = () => {
		if (isCurrentApp) {
			setCurrentApp(null);
		}

		setApps((apps) => omit(apps, id));
		void queryClient.invalidateQueries({ queryKey: oauthQueryKey });
	};

	return (
		<div
			className={cn(
				"p-4 my-4 flex items-center gap-2 border rounded-lg shadow",
				{ "border-green-500": isCurrentApp },
			)}
		>
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
				disabled={isCurrentApp || isError}
				onClick={() => setCurrentApp(id)}
			>
				Select
			</Button>
			<DeleteConfirmButton onClick={handleAppRemove} />
		</div>
	);
}

export default function AppsPage() {
	const [apps] = useApps();
	const ids: string[] = useMemo(() => Object.keys(apps ?? {}), [apps]);

	if (ids.length === 0) {
		return <Redirect to="/" />;
	}

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
