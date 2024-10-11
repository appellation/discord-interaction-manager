import { useQuery } from "@tanstack/react-query";
import type { RESTGetAPIApplicationCommandResult } from "discord-api-types/v10";
import { useParams } from "wouter";
import CommandEdit from "~/components/data/CommandEdit";
import { useQueryKey } from "~/lib/fetch";
import { useCurrentApp } from "~/lib/state";

export default function EditCommand() {
	const { commandId } = useParams();
	const [currentApp] = useCurrentApp();
	const queryKey = useQueryKey([
		"applications",
		currentApp,
		"commands",
		commandId,
	]);
	const { data } = useQuery<RESTGetAPIApplicationCommandResult>({
		queryKey,
		enabled: currentApp != null,
	});

	return (
		<main className="container mx-auto">
			<CommandEdit data={data} />
		</main>
	);
}
