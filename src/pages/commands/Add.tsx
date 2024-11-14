import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	APIApplicationCommand,
	RESTPostAPIApplicationCommandsResult,
} from "discord-api-types/v10";
import { useState } from "react";
import CommandEdit from "~/components/data/CommandEdit";
import { authFetch } from "~/lib/fetch";
import { useCurrentApp } from "~/lib/state";

export default function Add() {
	const [currentApp] = useCurrentApp();
	const queryClient = useQueryClient();
	const [data, setData] = useState<APIApplicationCommand>({});

	const { mutate, error } = useMutation({
		onMutate(value: APIApplicationCommand) {
			setData(value);
		},
		async mutationFn(value: APIApplicationCommand) {
			const result: RESTPostAPIApplicationCommandsResult = await authFetch(
				currentApp!,
				`/applications/${currentApp}/commands`,
				value,
				{ method: "POST" },
			);

			return result;
		},
		async onSuccess(data, variables, context) {
			await queryClient.invalidateQueries({
				queryKey: ["applications", currentApp],
			});
		},
	});

	return (
		<main className="container mx-auto">
			<CommandEdit data={data} error={error} onSubmit={mutate} />
		</main>
	);
}
