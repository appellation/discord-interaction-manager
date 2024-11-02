import { useMemo } from "react";
import { LoginDialog } from "~/components/LoginDialog";
import { Button } from "~/components/ui/button";
import { useFetchUser } from "~/lib/fetch";
import { useApps, useCurrentApp } from "~/lib/state";

function AppRow({ id }: { readonly id: string }) {
	const { data, error, isError } = useFetchUser(id);
	const [currentApp, setCurrentApp] = useCurrentApp();

	return (
		<div className="p-4 my-4 flex items-center gap-2 border rounded-lg shadow">
			<div className="grow-1">
				<span className="font-bold">{data?.application.name}</span>
				{error != null && (
					<>
						<br />
						<span className="color-red-600 font-semibold">{error.message}</span>
					</>
				)}
			</div>
			<Button
				disabled={currentApp === id || isError}
				onClick={() => setCurrentApp(id)}
			>
				Select
			</Button>
			<Button variant="destructive">Remove</Button>
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
