import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RESTPostAPIApplicationCommandsResult } from "discord-api-types/v10";
import type { Schema } from "~/components/data/CommandEdit";
import CommandEdit from "~/components/data/CommandEdit";
import { authFetch } from "~/lib/fetch";
import { useCurrentApp } from "~/lib/state";

export default function Add() {
	const [currentApp] = useCurrentApp();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		async mutationFn(value: Schema) {
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
			<CommandEdit data={{}} onSubmit={mutate} />
		</main>
	);
}
