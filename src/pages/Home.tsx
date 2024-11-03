import { useQuery } from "@tanstack/react-query";
import type { RESTGetAPIApplicationCommandsResult } from "discord-api-types/v10";
import { Link } from "wouter";
import CommandTable from "~/components/data/CommandTable";
import { Button } from "~/components/ui/button";
import { useQueryKey } from "~/lib/fetch";
import { useCurrentApp } from "~/lib/state";

export default function HomePage() {
	const [currentApp] = useCurrentApp();
	const queryKey = useQueryKey(["applications", currentApp, "commands"]);
	const { data, error } = useQuery<RESTGetAPIApplicationCommandsResult>({
		queryKey,
		enabled: currentApp != null,
	});

	return (
		<div className="container mx-auto">
			<div className="flex justify-end mb-2">
				<Button asChild variant="secondary">
					<Link to="/commands/add">Add</Link>
				</Button>
			</div>
			<CommandTable data={data ?? []} error={error} />
		</div>
	);
}
