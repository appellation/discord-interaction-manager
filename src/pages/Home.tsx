import CommandTable from "@/components/data/CommandTable";
import { useQueryKey } from "@/lib/fetch";
import { useCurrentApp } from "@/lib/state";
import { useQuery } from "@tanstack/react-query";
import { RESTGetAPIApplicationCommandsResult } from "discord-api-types/v10";

export default function HomePage() {
	const [currentApp] = useCurrentApp();
	const queryKey = useQueryKey(["applications", currentApp, "commands"]);
	const { data, error } = useQuery<RESTGetAPIApplicationCommandsResult>({
		queryKey,
		enabled: currentApp != null,
	});

	return (
		<div className="container mx-auto">
			<CommandTable data={data ?? []} error={error} />
		</div>
	);
}
