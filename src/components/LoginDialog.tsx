import { useForm } from "@modular-forms/react";
import { setApplicationInfo, setCurrentApp } from "@/lib/state";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { TextInput } from "./ui/text-input";

type LoginForm = {
	clientId: string;
	clientSecret: string;
};

async function handleSubmit({ clientId, clientSecret }: LoginForm) {
	const data = new URLSearchParams();
	data.set("grant_type", "client_credentials");
	data.set("scope", "identify applications.commands.update");

	const res = await fetch("https://discord.com/api/v10/oauth2/token", {
		body: data,
		headers: {
			authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
		},
		method: "POST",
	});

	if (!res.ok) {
		console.error(await res.text());
		return;
	}

	const body = await res.json();
	console.log(body);

	setApplicationInfo(clientId, {
		secret: clientSecret,
		token: body.access_token,
	});
	setCurrentApp(clientId);
}

export function LoginDialog() {
	const [{ submitting, response }, { Form, Field }] = useForm<LoginForm>();

	return (
		<DialogContent>
			<Form onSubmit={handleSubmit}>
				<DialogHeader>
					<DialogTitle>Login</DialogTitle>
					<DialogDescription>
						Find your login information in the Discord Developer portal.
					</DialogDescription>
				</DialogHeader>
				<div className="my-4">
					{response.value.status === "error" ? (
						<Alert variant="destructive">
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{response.value.message}</AlertDescription>
						</Alert>
					) : null}
					<Field name="clientId">
						{(_field, props) => (
							<TextInput {...props} type="text" label="Client ID" required />
						)}
					</Field>
					<Field name="clientSecret">
						{(_field, props) => (
							<TextInput
								{...props}
								type="password"
								label="Client Secret"
								required
							/>
						)}
					</Field>
				</div>
				<DialogFooter>
					<Button disabled={submitting.value} type="submit">
						Login
					</Button>
				</DialogFooter>
			</Form>
		</DialogContent>
	);
}
