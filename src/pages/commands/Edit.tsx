import { useMutation, useQuery } from "@tanstack/react-query";
import type {
	APIApplicationCommand,
	RESTGetAPIApplicationCommandResult,
} from "discord-api-types/v10";
import { useParams } from "wouter";
import CommandEdit from "~/components/data/CommandEdit";
import { doFetch, useQueryKey } from "~/lib/fetch";
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
	const { mutate } = useMutation<
		unknown,
		Error,
		{ value: APIApplicationCommand }
	>({
		async mutationFn({ value }) {
			await doFetch(
				currentApp!,
				`/applications/${currentApp}/commands/${commandId}`,
				value,
				{ method: "PATCH" },
			);
		},
	});

	return (
		<main className="container mx-auto mb-16">
			<CommandEdit data={data} onSubmit={mutate} />
		</main>
	);
}
