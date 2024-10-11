import { useApps, useCurrentApp } from "@/lib/state";
import { FormApi, useForm } from "@tanstack/react-form";
import { RESTPostOAuth2ClientCredentialsResult } from "discord-api-types/v10";
import { useState } from "react";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { FieldTextInput } from "./ui/text-input";
import { Button } from "./ui/button";

type LoginForm = {
	clientId: string;
	clientSecret: string;
};

async function onSubmit({
	value,
}: {
	value: LoginForm;
	formApi: FormApi<LoginForm>;
}) {
	const { clientId, clientSecret } = value;
	const [, setApps] = useApps();
	const [, setCurrentApp] = useCurrentApp();

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

	setApps((apps) => {
		return {
			...apps,
			[clientId]: {
				secret: clientSecret,
				token: body.access_token,
			},
		};
	});
	setCurrentApp(clientId);
}

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
	const {
		Field,
		handleSubmit,
		state: { canSubmit, isSubmitting },
	} = useForm<LoginForm>({
		onSubmit,
	});
	const [submitError, setSubmitError] = useState<Error>();
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit().then(onSuccess).catch(setSubmitError);
			}}
		>
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
							type="text"
							label="Client ID"
							required
						/>
					)}
				</Field>
				<Field name="clientSecret">
					{(field) => (
						<FieldTextInput
							field={field}
							type="password"
							label="Client Secret"
							required
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
