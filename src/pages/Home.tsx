import { useQuery } from "@tanstack/react-query";
import type { RESTGetAPIApplicationCommandsResult } from "discord-api-types/v10";
import { Link } from "wouter";
import { LoginDialog } from "~/components/LoginDialog";
import LoginMenu from "~/components/LoginMenu";
import CommandTable from "~/components/data/CommandTable";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/typography";
import { useQueryKey } from "~/lib/fetch";
import { useCurrentApp } from "~/lib/state";

function LoggedIn() {
	const [currentApp] = useCurrentApp();
	const queryKey = useQueryKey(["applications", currentApp, "commands"]);

	const { data, error } = useQuery<RESTGetAPIApplicationCommandsResult>({
		queryKey,
		enabled: currentApp != null,
	});

	return (
		<>
			<div className="flex justify-end mb-2">
				<Button asChild variant="secondary">
					<Link to="/commands/add">Add</Link>
				</Button>
			</div>
			<CommandTable data={data ?? []} error={error} />
		</>
	);
}

function LoggedOut() {
	return (
		<div className="text-center">
			<Heading className="mt-32 mb-4" level={1}>
				The missing Discord command manager
			</Heading>
			<h2 className="mb-12 text-gray-500 text-3xl font-medium">
				Manage your app's commands with an actual UI
			</h2>
			<LoginDialog asChild>
				<Button size="lg">Get Started</Button>
			</LoginDialog>
		</div>
	);
}

export default function HomePage() {
	const [currentApp] = useCurrentApp();

	return (
		<main className="container mx-auto">
			{currentApp == null ? <LoggedOut /> : <LoggedIn />}
		</main>
	);
}
