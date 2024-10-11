import type { FormApi } from "@tanstack/react-form";
import { useForm } from "@tanstack/react-form";
import type { RESTPostOAuth2ClientCredentialsResult } from "discord-api-types/v10";
import { useCallback, useState } from "react";
import { useApps, useCurrentApp } from "~/lib/state";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { FieldTextInput } from "./ui/text-input";

type LoginForm = {
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

	const onSubmit = useCallback(
		async ({ value }: { formApi: FormApi<LoginForm>; value: LoginForm }) => {
			const { clientId, clientSecret } = value;

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

			setApps((apps) => ({
				...apps,
				[clientId]: {
					secret: clientSecret,
					token: body.access_token,
				},
			}));
			setCurrentApp(clientId);
		},
		[setApps, setCurrentApp],
	);

	const {
		Field,
		handleSubmit,
		state: { canSubmit, isSubmitting },
	} = useForm<LoginForm>({ onSubmit });
	const [submitError, setSubmitError] = useState<Error>();

	const handleFormSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			try {
				await handleSubmit();
				onSuccess();
			} catch (error) {
				setSubmitError(error as Error);
			}
		},
		[handleSubmit, onSuccess],
	);

	return (
		<form onSubmit={async (event) => handleFormSubmit(event)}>
			<DialogHeader>
				<DialogTitle>Login</DialogTitle>
				<DialogDescription>
					Find your login information in the Discord Developer portal.
				</DialogDescription>
			</DialogHeader>
			<div className="my-4">
				{submitError ? (
					<Alert variant="destructive">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{submitError?.message}</AlertDescription>
					</Alert>
				) : null}
				<Field name="clientId">
					{(field) => (
						<FieldTextInput
							field={field}
							label="Client ID"
							required
							type="text"
						/>
					)}
				</Field>
				<Field name="clientSecret">
					{(field) => (
						<FieldTextInput
							field={field}
							label="Client Secret"
							required
							type="password"
						/>
					)}
				</Field>
			</div>
			<DialogFooter>
				<Button disabled={!canSubmit || isSubmitting} type="submit">
					Login
				</Button>
			</DialogFooter>
		</form>
	);
}
