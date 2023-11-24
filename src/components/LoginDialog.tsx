import { useForm } from "@modular-forms/react";
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
	client_id: string;
	client_secret: string;
};

function handleSubmit() {}

export function LoginDialog() {
	const [, { Form, Field }] = useForm<LoginForm>();

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
					<Field name="client_id">
						{(field, props) => (
							<TextInput
								{...props}
								error={field.error}
								value={field.value}
								type="text"
								label="Client ID"
								required
							/>
						)}
					</Field>
					<Field name="client_secret">
						{(field, props) => (
							<TextInput
								{...props}
								error={field.error}
								value={field.value}
								type="password"
								label="Client Secret"
								required
							/>
						)}
					</Field>
				</div>
				<DialogFooter>
					<Button type="submit">Login</Button>
				</DialogFooter>
			</Form>
		</DialogContent>
	);
}
