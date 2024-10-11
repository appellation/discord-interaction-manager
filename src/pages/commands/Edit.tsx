import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import type { RESTGetAPIApplicationCommandResult } from "discord-api-types/v10";
import { useParams } from "wouter";
import { CheckboxField } from "@/components/ui/checkbox";
import { FieldTextInput } from "@/components/ui/text-input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryKey } from "@/lib/fetch";
import { useCurrentApp } from "@/lib/state";

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
	const { Field } = useForm({
		defaultValues: data,
	});

	return (
		<main className="container mx-auto">
			<form>
				<Field name="name">
					{(field) => <FieldTextInput field={field} label="Name" type="text" />}
				</Field>
				<Field name="guild_id">
					{(field) => (
						<FieldTextInput
							disabled
							field={field}
							label="Guild ID"
							type="text"
						/>
					)}
				</Field>
				<Field name="description">
					{(field) => (
						<Textarea
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(error) => field.handleChange(error.target.value)}
							value={field.state.value}
						/>
					)}
				</Field>
				<Field name="default_member_permissions">
					{(field) => (
						<FieldTextInput
							field={field}
							label="Default Member Permissions"
							type="text"
						/>
					)}
				</Field>
				<div className="flex items-center gap-2">
					<Field name="dm_permission">
						{(field) => <CheckboxField field={field} label="DM Permission" />}
					</Field>
					<Field name="default_permission">
						{(field) => (
							<CheckboxField field={field} label="Default Permission" />
						)}
					</Field>
					<Field name="nsfw">
						{(field) => <CheckboxField field={field} label="NSFW" />}
					</Field>
				</div>
			</form>
		</main>
	);
}
