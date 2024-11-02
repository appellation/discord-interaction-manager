import { useMutation, useQuery } from "@tanstack/react-query";
import type {
	APIApplicationCommand,
	RESTGetAPIApplicationCommandResult,
} from "discord-api-types/v10";
import { useParams } from "wouter";
import ErrorAlert from "~/components/ErrorAlert";
import CommandEdit from "~/components/data/CommandEdit";
import { authFetch, queryClient, useQueryKey } from "~/lib/fetch";
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
	const { data, error } = useQuery<RESTGetAPIApplicationCommandResult>({
		queryKey,
		enabled: currentApp != null,
	});
	const { mutate } = useMutation<
		APIApplicationCommand,
		Error,
		APIApplicationCommand
	>({
		async mutationFn(value) {
			const command: APIApplicationCommand = await authFetch(
				currentApp!,
				`/applications/${currentApp}/commands/${commandId}`,
				value,
				{ method: "PATCH" },
			);

			return command;
		},
		onSuccess(data, variables, context) {
			queryClient.setQueryData(
				["applications", currentApp, "commands", commandId],
				data,
			);
		},
	});

	return (
		<main className="container mx-auto mb-16">
			<ErrorAlert error={error} />
			{data && <CommandEdit data={data} onSubmit={mutate} />}
		</main>
	);
}
