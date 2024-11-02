import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RESTPostOAuth2ClientCredentialsResult } from "discord-api-types/v10";
import { useCallback, type FormEvent } from "react";
import { useApps, useCurrentApp } from "~/lib/state";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { LabeledElement } from "./ui/label";

type LoginFormData = {
	clientId: string;
	clientSecret: string;
};

export default function LoginForm({
	onSuccess,
}: {
	onSuccess(this: void): void;
}) {
	const [, setApps] = useApps();
	const [, setCurrentApp] = useCurrentApp();
	const queryClient = useQueryClient();

	const { mutate, error, isPending } = useMutation({
		async mutationFn({ clientId, clientSecret }: LoginFormData) {
			const data = new URLSearchParams();
			data.set("grant_type", "client_credentials");
			data.set("scope", "applications.commands.update");

			const res = await fetch("https://discord.com/api/v10/oauth2/token", {
				body: data,
				headers: {
					authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
				},
				method: "POST",
			});

			if (!res.ok) {
				throw new Error(await res.text());
			}

			const body: RESTPostOAuth2ClientCredentialsResult = await res.json();
			return body;
		},
		async onSuccess({ access_token }, { clientId, clientSecret }) {
			setApps((apps) => ({
				...apps,
				[clientId]: {
					secret: clientSecret,
					token: access_token,
				},
			}));
			setCurrentApp(clientId);

			// Discord OAuth2 client ID happens to match application ID
			await queryClient.invalidateQueries({ queryKey: [clientId] });

			onSuccess();
		},
	});

	const handleFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const data = new FormData(event.currentTarget);
			mutate({
				clientId: data.get("clientId") as string,
				clientSecret: data.get("clientSecret") as string,
			});
		},
		[mutate],
	);

	return (
		<form onSubmit={handleFormSubmit}>
			<DialogHeader>
				<DialogTitle>Login</DialogTitle>
				<DialogDescription>
					Find your login information in the Discord Developer portal.
				</DialogDescription>
			</DialogHeader>
			<div className="my-4">
				{error ? (
					<Alert variant="destructive">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error?.message}</AlertDescription>
					</Alert>
				) : null}
				<LabeledElement label="Client ID">
					<Input name="clientId" required type="text" />
				</LabeledElement>
				<LabeledElement label="Client Secret">
					<Input name="clientSecret" required type="password" />
				</LabeledElement>
			</div>
			<DialogFooter>
				<Button disabled={isPending} type="submit">
					Login
				</Button>
			</DialogFooter>
		</form>
	);
}
